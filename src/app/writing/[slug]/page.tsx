import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? "Post not found" };
}

export default async function WritingPost({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:py-24">
      <Link
        href="/writing"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← Writing
      </Link>
      <div className="mt-6 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <span className="tabular text-sm text-muted">{post.date}</span>
      </div>
      <div className="mt-10 flex flex-col gap-5 text-[17px] leading-relaxed text-foreground/85">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
