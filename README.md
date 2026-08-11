# Personal Website

A personal site built with Next.js (App Router) and Tailwind CSS. A single
minimal page — name, short bio, and two categories (Writing, Speaking) each
showing a "latest" preview.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Making it yours

- `src/lib/data.ts` — your name, title, bio, and speaking history.
- `src/lib/posts.ts` — writing posts, as a plain array (no CMS needed).
- `src/app/page.tsx` — the home page layout/sections.
- `src/app/writing/` — writing index and post pages.

## Deploying

The easiest option is [Vercel](https://vercel.com/new), which is built by
the Next.js team and deploys straight from this repo. GitHub Pages,
Netlify, and Cloudflare Pages also work well for a static Next.js export.
