import type { Track } from "@/lib/types";

interface TrackListProps {
  tracks: Track[];
  activeId: number;
  isPlaying: boolean;
  onSelect: (id: number) => void;
}

export default function TrackList({
  tracks,
  activeId,
  isPlaying,
  onSelect,
}: TrackListProps) {
  return (
    <ol className="divide-y divide-walnut/60">
      {tracks.map((track) => {
        const isActive = track.id === activeId;
        return (
          <li key={track.id}>
            <button
              type="button"
              onClick={() => onSelect(track.id)}
              aria-current={isActive}
              className={`group flex w-full items-center gap-4 py-3 text-left transition-colors ${
                isActive ? "text-gold-bright" : "text-cream hover:text-gold"
              }`}
            >
              <span className="w-5 shrink-0 font-label text-xs text-gold-dim">
                {isActive && isPlaying ? (
                  <PlayingIndicator />
                ) : (
                  String(track.id).padStart(2, "0")
                )}
              </span>
              <span className="flex-1 truncate font-display text-base md:text-lg">
                {track.title}
              </span>
              <span className="shrink-0 font-label text-xs tabular-nums text-gold-dim">
                {track.duration}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Three small bars that dance while the active track is playing. */
function PlayingIndicator() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] animate-pulse rounded-full bg-gold-bright"
          style={{
            height: `${[6, 12, 9][i]}px`,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </span>
  );
}
