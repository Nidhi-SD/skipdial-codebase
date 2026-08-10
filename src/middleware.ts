import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe config only — see auth.config.ts for why the provider is omitted.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  /* Only the routes whose access actually depends on a session. Keeping the
     matcher narrow means static assets and the marketing pages never pay for
     a JWT decode. API routes do their own session checks and are excluded so
     an unauthenticated call still gets a JSON 401 rather than an HTML redirect. */
  matcher: ["/dashboard/:path*", "/login"],
};
