import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
};

export default function WritingIndex() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20 sm:py-28">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Home
      </Link>
      <h1 className="text-2xl font-medium">Writing</h1>
      <div className="flex flex-col divide-y divide-line border-t border-line">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="group flex flex-col gap-1 py-6"
          >
            <span className="font-medium group-hover:text-muted">
              {post.title}
            </span>
            <span className="text-sm text-muted">{post.date}</span>
            <span className="mt-1 text-foreground/80">{post.excerpt}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
