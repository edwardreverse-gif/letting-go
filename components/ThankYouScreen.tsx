"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Track } from "@/lib/types";

interface ThankYouScreenProps {
  tracks: Track[];
  onComplete: () => void;
}

const MIN_VISIBLE_MS = 15000;

/**
 * Shown immediately after a verified purchase. Stays up for a minimum of
 * 15 seconds — matching the "Preparing your album for offline
 * listening…" promise — while genuinely warming the cache for every
 * track and both pieces of artwork in the background. Only continues
 * once BOTH the timer and the caching fetches are done, whichever
 * takes longer.
 *
 * The fetches here don't manually write to Cache Storage — in a
 * production build (service worker active), the existing runtimeCaching
 * rules intercept these same requests and cache them automatically as a
 * side effect. In dev mode the service worker is disabled anyway, so
 * these are just prefetches with no offline benefit — consistent with
 * how offline behavior has been tested throughout (production builds
 * only).
 */
export default function ThankYouScreen({
  tracks,
  onComplete,
}: ThankYouScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const minimumDuration = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_VISIBLE_MS)
    );

    const warmCache = Promise.all([
      fetch("/cover.jpg").catch(() => null),
      fetch("/thankyou.jpg").catch(() => null),
      ...tracks.map((track) => fetch(`/${track.file}`).catch(() => null)),
    ]);

    Promise.all([minimumDuration, warmCache]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [tracks]);

  // Once ready, fade out, then let the parent actually unmount us.
  useEffect(() => {
    if (!ready) return;
    const timeout = setTimeout(onComplete, 500);
    return () => clearTimeout(timeout);
  }, [ready, onComplete]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-void px-6 text-center transition-opacity duration-500 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative h-56 w-56 max-w-[70vw] overflow-hidden rounded-lg shadow-vinyl md:h-72 md:w-72">
        <Image
          src="/thankyou.jpg"
          alt="Thank you for your purchase"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div>
        <p className="font-display text-2xl italic text-cream md:text-3xl">
          Thank you.
        </p>
        <p className="mt-3 max-w-xs font-label text-xs uppercase tracking-[0.2em] text-gold-dim">
          Preparing your album for offline listening…
        </p>
      </div>
    </div>
  );
}
