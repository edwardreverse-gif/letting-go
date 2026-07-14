"use client";

import { useState } from "react";
import type { AlbumInfo as AlbumInfoType, Track } from "@/lib/types";

interface AlbumInfoProps {
  album: AlbumInfoType;
  tracks: Track[];
}

/**
 * Liner notes — the digital equivalent of the booklet tucked inside a
 * vinyl sleeve. Surfaces the same content as info.txt (title, artist,
 * tracklist, credits) without duplicating it as a second data source.
 */
export default function AlbumInfo({ album, tracks }: AlbumInfoProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-label text-xs uppercase tracking-[0.2em] text-gold-dim underline-offset-4 transition-colors hover:text-gold hover:underline"
      >
        Liner Notes
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Liner notes"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 flex items-center justify-center bg-void/80 px-6 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-gold/30 bg-panel p-8 shadow-vinyl"
          >
            <p className="font-label text-xs uppercase tracking-[0.3em] text-gold-dim">
              {album.artist}
            </p>
            <h2 className="mt-1 font-display text-3xl italic text-cream">
              {album.title}
            </h2>

            <ol className="mt-6 space-y-2 border-t border-walnut/60 pt-4">
              {tracks.map((track) => (
                <li
                  key={track.id}
                  className="flex justify-between gap-4 font-body text-sm text-cream/90"
                >
                  <span className="truncate">
                    {track.id}. {track.title}
                  </span>
                  <span className="shrink-0 tabular-nums text-gold-dim">
                    {track.duration}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 border-t border-walnut/60 pt-4 font-body text-xs leading-relaxed text-gold-dim">
              {album.credits}
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-full border border-gold/40 py-2 font-label text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-void"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
