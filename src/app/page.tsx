import Image from "next/image";
import Link from "next/link";
import { profile, speaking } from "@/lib/data";
import { posts } from "@/lib/posts";

export default function Home() {
  const latestPost = posts[0];
  const latestSpeaking = speaking[0];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20 sm:py-28">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image
          src="/avatar.jpg"
          alt={profile.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
          priority
        />
        <h1 className="text-2xl font-medium">{profile.name}</h1>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-4 leading-relaxed text-foreground/90">
        <p>{profile.about}</p>
        <p>
          You can reach me by email at{" "}
          <a
            href={`mailto:${profile.email}`}
            className="underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground"
          >
            {profile.email}
          </a>{" "}
          or on{" "}
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground"
          >
            LinkedIn
          </a>
          .
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-col divide-y divide-line border-t border-line">
        <div className="py-6">
          <Link
            href="/writing"
            className="flex items-baseline justify-between"
          >
            <span className="text-lg">Writing</span>
            <span className="text-sm text-muted">Essays</span>
          </Link>
          {latestPost && (
            <Link
              href={`/writing/${latestPost.slug}`}
              className="group mt-4 flex flex-col gap-1"
            >
              <span className="text-xs tracking-wide text-muted uppercase">
                Latest
              </span>
              <span className="inline-flex items-baseline gap-1.5 font-medium group-hover:text-muted">
                {latestPost.title}
                <span aria-hidden className="text-sm">
                  ↗
                </span>
              </span>
              <span className="text-sm text-muted">{latestPost.date}</span>
            </Link>
          )}
        </div>

        <div className="py-6">
          <div className="flex items-baseline justify-between">
            <span className="text-lg">Speaking</span>
            <span className="text-sm text-muted">Engagements</span>
          </div>
          {latestSpeaking && (
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-xs tracking-wide text-muted uppercase">
                Latest
              </span>
              <span className="font-medium">{latestSpeaking.title}</span>
              <span className="text-sm text-muted">
                {latestSpeaking.context} · {latestSpeaking.period}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
