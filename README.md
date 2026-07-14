# Letting Go — Edward Reverse

Phase 1 foundation: an installable, offline-capable PWA album player.
No payment, auth, or database yet — the full album plays in "early access" mode.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Note:** the PWA service worker is disabled in `next dev` (this is the
> standard next-pwa behavior — SW + HMR don't mix well). To test install
> prompts and offline caching, use a production build instead:
>
> ```bash
> npm run build
> npm run start
> ```

## Before this is a real, playable album

The three tracks referenced in `public/tracks.json` (`audio/1.m4a`,
`audio/2.m4a`, `audio/3.m4a`) were **not** part of the uploaded assets —
only the metadata was. Drop the actual `.m4a` files into `public/audio/`
using those exact filenames before deploying; the player UI works
today, but playback will 404 until the audio is in place.

## What's here

- Player UI: cover art, tracklist, transport controls, seekable progress bar
- Installable PWA: manifest + service worker via `@ducanh2912/next-pwa`
- Offline-ready: app shell precached; audio cached on first play
- No Razorpay, no auth, no database — see the architecture doc for the
  planned integration path

## Deploying to Vercel

Push to a Git repo and import it in Vercel — zero extra config needed,
`next.config.mjs` already wraps the build with the PWA plugin.
