import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-1 rounded-xl border border-black/10 p-5 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-medium group-hover:underline">
                {post.title}
              </h2>
              <span className="shrink-0 text-sm text-foreground/50">
                {post.date}
              </span>
            </div>
            <p className="text-sm text-foreground/70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
