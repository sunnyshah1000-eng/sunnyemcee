import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
};

export default function WritingIndex() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← Home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">
        Writing
      </h1>
      <div className="mt-12 flex flex-col divide-y divide-line border-t border-line">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="group flex flex-col gap-1.5 py-7"
          >
            <div className="flex items-baseline gap-4">
              <span className="tabular text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-lg font-bold tracking-tight transition-colors group-hover:text-accent">
                {post.title}
              </span>
            </div>
            <span className="tabular pl-9 text-sm text-muted">
              {post.date}
            </span>
            <p className="pl-9 text-foreground/75">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
