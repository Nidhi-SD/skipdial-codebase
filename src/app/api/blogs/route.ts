import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET reads live rows on every request; without this, Next.js can statically
// cache this handler's response at build time (Route Handlers with no dynamic
// API usage are cached by default), which would hide newly-created posts.
export const dynamic = "force-dynamic";

const MAX_SLUG_ATTEMPTS = 25;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/blogs — public
export async function GET() {
  try {
    const blogs = await prisma.post.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(blogs);
  } catch (err) {
    console.error("GET /api/blogs failed:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/blogs — admin only
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, category, excerpt, content, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(String(title)) || "post";

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const id = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
      try {
        const newBlog = await prisma.post.create({
          data: {
            id,
            title,
            category: category || "General",
            excerpt: excerpt || content.slice(0, 160) + "...",
            content,
            coverImage: coverImage || "",
            authorName: session.user.name || "Admin",
          },
        });
        return NextResponse.json(newBlog, { status: 201 });
      } catch (err) {
        const isSlugCollision =
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002";
        if (!isSlugCollision) throw err;
        // id already taken — loop again with the next "-N" suffix
      }
    }

    throw new Error(
      `Could not find a unique slug for "${title}" after ${MAX_SLUG_ATTEMPTS} attempts`
    );
  } catch (err) {
    console.error("POST /api/blogs failed:", err);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
