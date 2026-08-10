# Personal Website

A personal site built with Next.js (App Router) and Tailwind CSS. Includes
About, Experience, Projects, a simple Blog, and Contact sections.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Making it yours

- `src/lib/data.ts` — your name, title, bio, work experience, education,
  and projects.
- `src/lib/posts.ts` — blog posts, as a plain array (no CMS needed).
- `src/app/page.tsx` — the home page layout/sections.
- `src/app/blog/` — blog index and post pages.

## Deploying

The easiest option is [Vercel](https://vercel.com/new), which is built by
the Next.js team and deploys straight from this repo. GitHub Pages,
Netlify, and Cloudflare Pages also work well for a static Next.js export.
