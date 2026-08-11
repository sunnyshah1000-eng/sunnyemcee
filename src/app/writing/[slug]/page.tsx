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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20">
      <Link
        href="/writing"
        className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-accent"
      >
        ← Writing
      </Link>
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-3xl sm:text-4xl">{post.title}</h1>
        <span className="text-xs tracking-[0.15em] text-muted uppercase">
          {post.date}
        </span>
      </div>
      <div className="flex flex-col gap-5 text-lg leading-relaxed text-foreground/80">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
