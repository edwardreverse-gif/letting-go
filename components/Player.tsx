"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AlbumInfo as AlbumInfoData, Track } from "@/lib/types";
import AlbumCover from "@/components/AlbumCover";
import VinylDisc from "@/components/VinylDisc";
import TrackList from "@/components/TrackList";
import ProgressBar from "@/components/ProgressBar";
import AlbumInfo from "@/components/AlbumInfo";
import InstallButton from "@/components/InstallButton";
import ThankYouScreen from "@/components/ThankYouScreen";

interface PlayerProps {
  album: AlbumInfoData;
  tracks: Track[];
  razorpayKeyId: string | null;
}

export default function Player({ album, tracks, razorpayKeyId }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeId, setActiveId] = useState<number>(tracks[0]?.id ?? 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  const activeTrack = tracks.find((t) => t.id === activeId) ?? tracks[0];
  const activeIndex = tracks.findIndex((t) => t.id === activeId);

  // Load the new source whenever the active track changes, then play if
  // we were already in a playing state (e.g. user hit "next").
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;
    audio.src = `/${activeTrack.file}`;
    audio.load();
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const skip = useCallback(
    (delta: 1 | -1) => {
      const nextIndex = (activeIndex + delta + tracks.length) % tracks.length;
      setActiveId(tracks[nextIndex].id);
      setIsPlaying(true);
    },
    [activeIndex, tracks]
  );

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  function selectTrack(id: number) {
    if (id === activeId) {
      togglePlay();
      return;
    }
    setActiveId(id);
    setIsPlaying(true);
  }

  // Media Session: lock-screen / notification-shade playback controls on
  // Android and iOS Safari. Metadata updates whenever the active track
  // changes; action handlers are wired once and read the latest
  // togglePlay/skip/seek via the callbacks above (stable across renders
  // except when track order or index actually changes).
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    if (!activeTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTrack.title,
      artist: album.artist,
      album: album.title,
      artwork: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  }, [activeTrack, album]);

  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.setActionHandler("play", togglePlay);
    navigator.mediaSession.setActionHandler("pause", togglePlay);
    navigator.mediaSession.setActionHandler("previoustrack", () => skip(-1));
    navigator.mediaSession.setActionHandler("nexttrack", () => skip(1));
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (typeof details.seekTime === "number") seek(details.seekTime);
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [togglePlay, skip, seek]);

  // Keep the lock-screen playback state (and scrubber, where supported)
  // in sync with what's actually happening in the <audio> element.
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("mediaSession" in navigator) ||
      !("setPositionState" in navigator.mediaSession) ||
      !duration
    ) {
      return;
    }
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: Math.min(currentTime, duration),
      });
    } catch {
      // Some browsers throw if position/duration momentarily disagree
      // (e.g. right after a seek) — safe to ignore, next tick corrects it.
    }
  }, [currentTime, duration]);

  return (
    <div className="md:grid md:h-screen md:grid-cols-2">
      {showThankYou && (
        <ThankYouScreen
          tracks={tracks}
          onComplete={() => setShowThankYou(false)}
        />
      )}

      {/* Left: cover art with the vinyl disc peeking out */}
      <div className="relative">
        <AlbumCover album={album} />
        <div className="absolute -bottom-10 right-6 hidden md:block lg:right-10">
          <VinylDisc isPlaying={isPlaying} size={200} />
        </div>
      </div>

      {/* Right: title, tracklist, transport */}
      <div className="flex flex-col justify-between gap-8 bg-panel px-6 py-10 md:h-screen md:overflow-y-auto md:px-12 md:py-14">
        <header>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-gold-dim">
            {album.artist}
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-cream md:text-5xl">
            {album.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="inline-block rounded-full border border-gold/40 px-3 py-1 font-label text-[11px] uppercase tracking-[0.2em] text-gold">
              {album.tagline}
            </span>
            <AlbumInfo album={album} tracks={tracks} />
          </div>
          <div className="mt-6">
            <InstallButton />
          </div>
        </header>

        <div className="flex-1">
          <TrackList
            tracks={tracks}
            activeId={activeId}
            isPlaying={isPlaying}
            onSelect={selectTrack}
          />
        </div>

        <footer className="space-y-5">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
          />

          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => skip(-1)}
              aria-label="Previous track"
              className="text-gold-dim transition-colors hover:text-gold"
            >
              <SkipIcon direction="prev" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-void shadow-vinyl transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              onClick={() => skip(1)}
              aria-label="Next track"
              className="text-gold-dim transition-colors hover:text-gold"
            >
              <SkipIcon direction="next" />
            </button>
          </div>

          <p className="text-center font-label text-[11px] leading-relaxed text-gold-dim/80">
            {album.credits}
          </p>
        </footer>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => skip(1)}
        preload="metadata"
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}

function SkipIcon({ direction }: { direction: "prev" | "next" }) {
  if (direction === "next") {
    // ▶| — triangle leading (pointing right), stop-bar trailing on the right
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 5l9 7-9 7zM17 5h2v14h-2z" />
      </svg>
    );
  }
  // |◀ — stop-bar leading on the left, triangle trailing (pointing left)
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 5h2v14H5zM18 5l-9 7 9 7z" />
    </svg>
  );
}
