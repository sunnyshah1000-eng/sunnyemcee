import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
};

export default function WritingIndex() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20">
      <h1 className="font-serif text-3xl text-accent italic">Writing</h1>
      <div className="flex flex-col">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="group block border-t border-line py-6 first:pt-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="font-serif text-xl transition-colors group-hover:text-accent">
                {post.title}
              </h2>
              <span className="text-xs tracking-[0.15em] text-muted uppercase">
                {post.date}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-foreground/70">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
