import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // By default this plugin precaches EVERY file in public/ at install
  // time — including the multi-MB audio files, which defeats the whole
  // point of the on-demand runtimeCaching rule below. Excluding them here
  // means audio is only cached the first time a user actually presses
  // play, not force-downloaded the moment the service worker installs.
  publicExcludes: ["!audio/**/*"],
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    // App shell + build assets are precached automatically by next-pwa.
    // Audio files are intentionally NOT precached here — they're large
    // (multi-MB .m4a) and are instead cached on-demand at runtime below,
    // the first time a user actually presses play on a track.
    runtimeCaching: [
      {
        // Album audio: cache-first once fetched, with range-request
        // support so seeking on a cached track still works offline.
        urlPattern: /\/audio\/.*\.m4a$/i,
        handler: "CacheFirst",
        method: "GET",
        options: {
          cacheName: "album-audio",
          rangeRequests: true,
          // Skip the browser's own HTTP conditional-request cache (the
          // one that produces empty 304 "Not Modified" responses). We
          // want workbox's own Cache Storage to be the source of truth
          // for offline audio, so every fetch here should return the
          // full response body, not a 304 with nothing to store.
          fetchOptions: {
            cache: "no-store",
          },
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200, 206],
          },
        },
      },
      {
        // Cover / thank-you artwork: cache-first, small and static.
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "album-images",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // These are small, already-optimized local assets (cover art, icons).
    // Running them through Next's on-the-fly /_next/image optimizer adds
    // no real benefit here, and it broke offline caching — the optimizer
    // URL didn't match our runtime caching rule below. Serving them as
    // plain static files means the existing image cache rule just works.
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
