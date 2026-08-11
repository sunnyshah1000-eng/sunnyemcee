import Link from "next/link";
import { profile, speaking } from "@/lib/data";
import { posts } from "@/lib/posts";

export default function Home() {
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-20 px-6 py-20">
      {/* Hero */}
      <section className="flex flex-col gap-6">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">
          Hi, I&apos;m {profile.name.split(" ")[0]}
        </p>
        <h1 className="font-serif text-4xl leading-[1.1] sm:text-6xl">
          {profile.title}
        </h1>
        <p className="max-w-lg font-serif text-xl text-foreground/70 italic">
          {profile.tagline}
        </p>
        <div className="flex gap-6 pt-2 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Get in touch
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/70 underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground/60"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 border-t border-line pt-16">
        <h2 className="mb-6 font-serif text-2xl text-accent italic">About</h2>
        <p className="max-w-xl text-lg leading-relaxed whitespace-pre-line text-foreground/80">
          {profile.about}
        </p>
      </section>

      {/* Speaking */}
      <section id="speaking" className="scroll-mt-24">
        <h2 className="mb-8 font-serif text-2xl text-accent italic">
          Speaking
        </h2>
        <div className="flex flex-col">
          {speaking.map((item) => (
            <div
              key={item.title}
              className="border-t border-line py-6 first:pt-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-serif text-xl">{item.title}</h3>
                <span className="text-xs tracking-[0.15em] text-muted uppercase">
                  {item.context} · {item.period}
                </span>
              </div>
              <p className="mt-2 max-w-xl text-foreground/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section id="writing" className="scroll-mt-24">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-accent italic">Writing</h2>
          <Link
            href="/writing"
            className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-accent"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-col">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group block border-t border-line py-6 first:pt-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-serif text-xl transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
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
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-line pt-16 pb-8"
      >
        <h2 className="mb-6 font-serif text-2xl text-accent italic">
          Contact
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="font-serif text-3xl transition-colors hover:text-accent sm:text-4xl"
        >
          {profile.email}
        </a>
        <p className="mt-4 text-sm">
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-muted underline underline-offset-4 hover:text-accent"
          >
            LinkedIn
          </a>
        </p>
      </section>
    </div>
  );
}
