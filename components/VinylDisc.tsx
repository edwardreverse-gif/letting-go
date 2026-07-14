"use client";

import Image from "next/image";

interface VinylDiscProps {
  isPlaying: boolean;
  size?: number;
}

/**
 * The signature element of the player: the tuning-peg icon from the cover
 * art, re-used as the vinyl record's center label, spinning at 33⅓-ish
 * pace whenever a track is playing. Grounds the "boutique record player"
 * feel in an asset that's actually part of this release's identity,
 * rather than a generic disc graphic.
 */
export default function VinylDisc({ isPlaying, size = 220 }: VinylDiscProps) {
  return (
    <div
      className="relative shrink-0 rounded-full shadow-vinyl"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Grooved vinyl body */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,#2a211a_0%,#15100c_55%,#0c0908_100%)]">
        <div className="absolute inset-[6%] rounded-full border border-walnut/40" />
        <div className="absolute inset-[14%] rounded-full border border-walnut/30" />
        <div className="absolute inset-[22%] rounded-full border border-walnut/25" />
      </div>

      {/* Spinning label — the icon.png artwork */}
      <div
        className={`absolute inset-[30%] rounded-full overflow-hidden ring-2 ring-gold/40 ${
          isPlaying ? "animate-spin-slow" : ""
        }`}
      >
        <Image
          src="/icon.png"
          alt=""
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
