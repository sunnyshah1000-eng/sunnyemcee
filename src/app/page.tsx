import Link from "next/link";
import { profile, projects, experience } from "@/lib/data";
import { posts } from "@/lib/posts";

export default function Home() {
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-24 px-6 py-16">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground/60">
          Hi, I&apos;m {profile.name.split(" ")[0]} 👋
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {profile.title}
        </h1>
        <p className="max-w-xl text-foreground/70">{profile.tagline}</p>
        <div className="flex gap-4 pt-2 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 px-4 py-2 font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">About</h2>
        <p className="max-w-2xl whitespace-pre-line text-foreground/70">
          {profile.about}
        </p>
      </section>

      {/* Experience */}
      <section id="experience" className="scroll-mt-24">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Experience
        </h2>
        <div className="flex flex-col gap-8">
          {experience.map((item) => (
            <div key={item.role + item.org} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium">
                  {item.role} · {item.org}
                </h3>
                <span className="text-sm text-foreground/50">
                  {item.period}
                </span>
              </div>
              <p className="text-sm text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section id="projects" className="scroll-mt-24">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Highlights
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-col gap-2 rounded-xl border border-black/10 p-5 dark:border-white/10"
            >
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-foreground/70">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-foreground/60 dark:bg-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 pt-2 text-sm">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4 hover:opacity-80"
                  >
                    Live
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4 hover:opacity-80"
                  >
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog preview */}
      <section id="blog" className="scroll-mt-24">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            From the blog
          </h2>
          <Link
            href="/blog"
            className="text-sm underline underline-offset-4 hover:opacity-80"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-black/10 p-5 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium group-hover:underline">
                  {post.title}
                </h3>
                <span className="shrink-0 text-sm text-foreground/50">
                  {post.date}
                </span>
              </div>
              <p className="text-sm text-foreground/70">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Contact</h2>
        <p className="mb-4 max-w-xl text-foreground/70">
          Best way to reach me is email — feel free to say hi.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90"
          >
            {profile.email}
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 px-4 py-2 font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            GitHub
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 px-4 py-2 font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
