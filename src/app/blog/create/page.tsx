"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { fadeUp, staggerContainer } from "@/lib/motion";


export default function CreateBlogPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userIsAdmin = isAdmin(session?.user?.role);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect non-admins away
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !userIsAdmin) {
      router.replace("/blog");
    }
  }, [status, session, userIsAdmin, router]);

  if (status === "loading" || !userIsAdmin) {
    return (
      <section className="pt-40 pb-20 min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, excerpt, content, coverImage }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create blog");
      }

      router.push("/blog");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-36 pb-8 md:pt-44 md:pb-12 hero-wash px-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-[760px] mx-auto"
        >
          <motion.div variants={fadeUp}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to blog
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent mb-4"
          >
            Admin
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-tight text-ink"
          >
            Create a new <span className="text-accent">post.</span>
          </motion.h1>
        </motion.div>
      </section>

      <section className="pb-24 md:pb-32 px-6 bg-bg">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="max-w-[760px] mx-auto space-y-8"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="blog-title"
              className="block text-xs font-mono uppercase tracking-[0.2em] text-ink-light mb-2"
            >
              Title *
            </label>
            <input
              id="blog-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter blog post title"
              className="w-full px-5 py-3.5 rounded-xl border border-line bg-bg text-ink font-display text-lg placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="blog-category"
              className="block text-xs font-mono uppercase tracking-[0.2em] text-ink-light mb-2"
            >
              Category
            </label>
            <input
              id="blog-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Industry Insights, Guides, News"
              className="w-full px-5 py-3.5 rounded-xl border border-line bg-bg text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label
              htmlFor="blog-cover"
              className="block text-xs font-mono uppercase tracking-[0.2em] text-ink-light mb-2"
            >
              Cover Image URL
            </label>
            <input
              id="blog-cover"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-5 py-3.5 rounded-xl border border-line bg-bg text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="blog-excerpt"
              className="block text-xs font-mono uppercase tracking-[0.2em] text-ink-light mb-2"
            >
              Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="A short summary that appears on the blog listing page"
              className="w-full px-5 py-3.5 rounded-xl border border-line bg-bg text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300 resize-none"
            />
          </div>

          {/* Content (Markdown) */}
          <div>
            <label
              htmlFor="blog-content"
              className="block text-xs font-mono uppercase tracking-[0.2em] text-ink-light mb-2"
            >
              Content (Markdown) *
            </label>
            <textarea
              id="blog-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={16}
              placeholder={"## Your heading\n\nWrite your blog post content here using markdown...\n\n- Bullet points\n- **Bold text**\n- *Italic text*"}
              className="w-full px-5 py-3.5 rounded-xl border border-line bg-bg text-ink font-mono text-sm placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300 resize-y min-h-[200px]"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 text-[14px] font-semibold text-ink-inverse shadow-card transition-all duration-200 hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish Post
                </>
              )}
            </button>
            <Link
              href="/blog"
              className="px-6 py-3 rounded-lg border border-line text-ink-light text-sm font-medium hover:bg-surface-alt transition-all duration-300"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </section>
    </>
  );
}
