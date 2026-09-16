# AI Content Coach

A voice-first coaching prototype built with Next.js (App Router). The whole
app is a live voice conversation with a warm, curious AI coach that helps
you think through the content you create — no forms, no setup screens.
Open it and start talking.

## How it works

- **Speech in / speech out**: the browser's Web Speech API handles
  speech-to-text and text-to-speech. Optimized for desktop Chrome.
- **The conversation**: transcribed text is sent to Claude (Anthropic API),
  which drives the coach's personality and replies.
- **Memory**: every conversation is stored locally in `data/memory.json`.
  Each time you reopen the app, it's a new session, but the coach carries
  forward what it's learned about you from every past one.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome and allow
microphone access when prompted.

## Installing it like an app

The deployed site is installable — no app store needed:

- **Android (Chrome)**: open the site, tap the ⋮ menu, tap "Add to Home
  screen" (or Chrome may prompt automatically). It launches full-screen
  with its own icon, and voice recognition works the same as in the
  browser.
- **iPhone (Safari)**: open the site, tap the Share icon, tap "Add to Home
  Screen". It launches full-screen with its own icon. Note: iOS Safari's
  speech recognition support is limited, so voice input may be less
  reliable there than on Android/desktop Chrome.

This is powered by `src/app/manifest.ts` (the web app manifest) plus the
`icon-192`/`icon-512`/`apple-icon` routes and the `appleWebApp` metadata in
`src/app/layout.tsx`.

## Project layout

- `src/lib/useVoiceCoach.ts` — the client-side voice state machine (mic
  permission, speech recognition, turn-taking, interruption, silence
  nudges, text-to-speech).
- `src/app/page.tsx` — the minimal UI: a single state indicator (listening
  / thinking / speaking) plus a live caption.
- `src/lib/coach.ts` — the coach's persona/system prompt and the call to
  Claude.
- `src/lib/memory.ts` — the local JSON-backed memory store, keyed by
  session, structured so a future summarization/pruning pass can be added
  without changing the shape.
- `src/app/api/session/route.ts` / `src/app/api/chat/route.ts` — server
  routes that keep the Anthropic API key server-side.

## Notes on this prototype

- Single user, no accounts — `data/memory.json` is the only store.
- Memory accumulates indefinitely for now; no summarization/pruning yet.
- No recording, editing, or mobile app — browser-based voice chat only.
