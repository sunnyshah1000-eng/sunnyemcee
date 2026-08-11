import Image from "next/image";
import Link from "next/link";
import { profile, speaking } from "@/lib/data";
import { posts } from "@/lib/posts";

export default function Home() {
  const latestPost = posts[0];
  const latestSpeaking = speaking[0];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 sm:py-24">
      {/* Hero */}
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {profile.title}
          </p>
          <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
        </div>
        <Image
          src="/avatar.jpg"
          alt={profile.name}
          width={112}
          height={112}
          priority
          className="h-20 w-20 shrink-0 rounded-2xl object-cover grayscale transition-all duration-500 hover:grayscale-0 sm:h-28 sm:w-28"
        />
      </header>

      {/* Bio */}
      <div className="mt-10 flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/80 sm:text-base">
        <p>{profile.about}</p>
        <p>
          Reach out by email at{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
          >
            {profile.email}
          </a>{" "}
          or on{" "}
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          .
        </p>
      </div>

      {/* Index */}
      <div className="mt-16 flex flex-col divide-y divide-line border-t border-line">
        <div className="py-7">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-4">
              <span className="tabular text-sm text-accent">01</span>
              <Link
                href="/writing"
                className="font-display text-xl font-bold tracking-tight transition-colors hover:text-accent"
              >
                Writing
              </Link>
            </div>
            <span className="text-sm text-muted">Essays</span>
          </div>
          {latestPost && (
            <Link
              href={`/writing/${latestPost.slug}`}
              className="group mt-5 flex flex-col gap-1 pl-9"
            >
              <span className="text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
                Latest
              </span>
              <span className="inline-flex items-baseline gap-1.5 font-medium transition-colors group-hover:text-accent">
                {latestPost.title}
                <span aria-hidden className="text-sm">
                  ↗
                </span>
              </span>
              <span className="tabular text-sm text-muted">
                {latestPost.date}
              </span>
            </Link>
          )}
        </div>

        <div className="py-7">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-4">
              <span className="tabular text-sm text-accent">02</span>
              <span className="font-display text-xl font-bold tracking-tight">
                Speaking
              </span>
            </div>
            <span className="text-sm text-muted">Engagements</span>
          </div>
          {latestSpeaking && (
            <div className="mt-5 flex flex-col gap-1 pl-9">
              <span className="text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
                Latest
              </span>
              <span className="font-medium">{latestSpeaking.title}</span>
              <span className="tabular text-sm text-muted">
                {latestSpeaking.context} · {latestSpeaking.period}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 flex items-center gap-2 text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {profile.name} · {new Date().getFullYear()}
      </div>
    </div>
  );
}
