"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Plus, ArrowRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { PageHero, Section } from "@/components/blocks";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { isAdmin } from "@/lib/admin";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  authorName: string;
}

export default function Blog() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const userIsAdmin = isAdmin(session?.user?.role);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="The SkipDial"
        mutedTitle="Journal"
        center
        body="News, guides, and insights on AI call automation and business operations."
      />

      <Section className="min-h-[50vh] pt-0">
        <Container>
          {/* Admin: New Post button */}
          {userIsAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex justify-end"
            >
              <Link
                href="/blog/create"
                className="flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14px] font-semibold text-ink-inverse shadow-card transition-all duration-200 hover:bg-accent-deep hover:shadow-lift"
              >
                <Plus aria-hidden className="h-4 w-4" />
                New Post
              </Link>
            </motion.div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20" role="status">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              <span className="sr-only">Loading posts…</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && blogs.length === 0 && (
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeUp}
              className="rounded-2xl border border-dashed border-line-strong bg-surface-alt/40 py-20 text-center"
            >
              <p className="text-[16px] font-medium text-ink">No posts yet.</p>
              <p className="mt-1 text-[14px] text-ink-light">
                Check back soon. We&apos;re working on it.
              </p>
            </motion.div>
          )}

          {/* Blog grid */}
          {!loading && blogs.length > 0 && (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {blogs.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeUp}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-accent/25 hover:shadow-lift"
                >
                  <Link href={`/blog/${post.id}`} className="block">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.coverImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent-tint via-wash to-surface-alt">
                          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent/50">
                            {post.category || "SkipDial"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {post.category ? (
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                          {post.category}
                        </p>
                      ) : null}
                      <h2 className="line-clamp-2 text-[19px] font-bold leading-snug transition-colors duration-300 group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-ink-light">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink-light">
                          <Calendar aria-hidden className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          Read
                          <ArrowRight aria-hidden className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </Container>
      </Section>
    </>
  );
}
