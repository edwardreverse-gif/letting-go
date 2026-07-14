interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: ProgressBarProps) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center gap-3">
      <span className="w-10 shrink-0 font-label text-xs tabular-nums text-gold-dim">
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        aria-label="Seek"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-walnut accent-gold"
        style={{
          background: `linear-gradient(to right, #D4A574 ${pct}%, #3D2B1F ${pct}%)`,
        }}
      />
      <span className="w-10 shrink-0 text-right font-label text-xs tabular-nums text-gold-dim">
        {formatTime(duration)}
      </span>
    </div>
  );
}
