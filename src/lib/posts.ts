export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello, world",
    date: "2026-01-01",
    excerpt:
      "The obligatory first post — why I built this site and what I plan to write about.",
    content: [
      "This is the first post on this site. Replace it with something real whenever you're ready.",
      "The blog lives in src/lib/posts.ts as a plain array, so adding a new post is just adding a new object to that array — no CMS required.",
    ],
  },
  {
    slug: "whats-next",
    title: "What I'm working on",
    date: "2026-02-01",
    excerpt: "A quick update on current projects and what's coming next.",
    content: [
      "A placeholder second post so the blog list doesn't look empty.",
      "Swap this content for a real update on what you're building.",
    ],
  },
];
