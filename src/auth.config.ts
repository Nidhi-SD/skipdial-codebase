import type { NextAuthConfig } from "next-auth";

/* Edge-safe half of the Auth.js config.
 *
 * Middleware runs on the Edge runtime, where Prisma and bcrypt cannot load.
 * Everything here is pure JWT/route logic so `middleware.ts` can import it;
 * the Credentials provider (which needs both) is added in `auth.ts`, which
 * only ever runs in the Node runtime. */

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "development-secret-change-me";

export const authConfig = {
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Real providers are attached in auth.ts. Middleware only decodes the
  // session cookie, so an empty list here is sufficient — and required, since
  // the provider pulls in Node-only dependencies.
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    /** Runs in middleware only. Returning false sends the visitor to the
     *  sign-in page with a callbackUrl already attached. */
    authorized({ auth, request }) {
      const signedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/dashboard")) return signedIn;

      // Signed-in clients have no reason to see the login form again.
      if (pathname === "/login" && signedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
