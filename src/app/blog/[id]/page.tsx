"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { fadeUp, staggerContainer } from "@/lib/motion";

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

// Simple markdown-to-HTML renderer for basic blog content.
// Handles: headings, bold, italic, links, blockquotes, lists, tables, paragraphs.
function renderMarkdown(md: string): string {
  let html = md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="font-display font-semibold text-xl mt-10 mb-4 text-ink">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-display font-semibold text-2xl mt-12 mb-5 text-ink">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-display font-bold text-3xl mt-14 mb-6 text-ink">$1</h1>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent/30 pl-5 my-6 text-ink-light italic">$1</blockquote>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors">$1</a>');

  // Tables
  html = html.replace(
    /(\|.+\|\n)+/g,
    (tableBlock) => {
      const rows = tableBlock.trim().split("\n").filter((r) => !r.match(/^\|[\s-|]+\|$/));
      if (rows.length === 0) return tableBlock;
      const headerCells = rows[0].split("|").filter(Boolean).map((c) => c.trim());
      const bodyRows = rows.slice(1);
      let t = '<div class="overflow-x-auto my-8"><table class="w-full text-sm border border-line rounded-xl overflow-hidden">';
      t += "<thead><tr>";
      headerCells.forEach((c) => (t += `<th class="text-left px-4 py-3 bg-surface-alt font-semibold text-ink border-b border-line">${c}</th>`));
      t += "</tr></thead><tbody>";
      bodyRows.forEach((row) => {
        const cells = row.split("|").filter(Boolean).map((c) => c.trim());
        t += "<tr>";
        cells.forEach((c) => (t += `<td class="px-4 py-3 border-b border-line/50 text-ink-light">${c}</td>`));
        t += "</tr>";
      });
      t += "</tbody></table></div>";
      return t;
    }
  );

  // Unordered lists
  html = html.replace(
    /(^- .+$(\n|$))+/gm,
    (listBlock) => {
      const items = listBlock.trim().split("\n").map((l) => l.replace(/^- /, ""));
      return `<ul class="list-disc list-inside space-y-2 my-6 text-ink-light">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    }
  );

  // Paragraphs: wrap remaining bare text lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;
      return `<p class="text-ink-light leading-relaxed mb-6">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((blogs: BlogPost[]) => {
        const found = blogs.find((b) => b.id === params.id);
        if (found) {
          setPost(found);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <section className="pt-40 pb-20 min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </section>
    );
  }

  if (notFound || !post) {
    return (
      <section className="pt-40 pb-20 min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
        <h1 className="font-display font-bold text-3xl text-ink">Post not found</h1>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20 hero-wash px-6">
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
              All posts
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent mb-5"
          >
            {post.category}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-tight mb-6 text-ink"
          >
            {post.title}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-6 text-sm text-ink-light"
          >
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32 px-6 bg-bg">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[760px] mx-auto prose-custom"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(renderMarkdown(post.content)),
          }}
        />

        {/* Bottom nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-[760px] mx-auto mt-16 pt-10 border-t border-line"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>
        </motion.div>
      </section>
    </>
  );
}
