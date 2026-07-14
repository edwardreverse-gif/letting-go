import tracksData from "@/public/tracks.json";
import type { AlbumInfo, Track } from "@/lib/types";

// tracks.json is bundled at build time — no client-side fetch needed.
export const tracks: Track[] = tracksData;

// Sourced from info.txt. Kept as a typed constant rather than parsed at
// runtime, since this metadata doesn't change without a redeploy anyway.
export const album: AlbumInfo = {
  title: "Letting Go",
  artist: "Edward Reverse",
  tagline: "Exclusive Early Release",
  credits: "Produced, mixed & mastered by Rishabhaa V. © Edward Reverse 2026",
};
