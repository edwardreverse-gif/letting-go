"use client";

interface SocialPanelProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const YOUTUBE_URL = "https://www.youtube.com/@edwardreverseproductions";
const INSTAGRAM_URL = "https://www.instagram.com/edwardxreverse/";

// Placeholder — a real show hasn't been booked yet. April 31st isn't a
// real calendar date; kept exactly as given since it's a stand-in value.
const upcomingShows = [{ date: "April 31st, 2027", venue: "TBA" }];

export default function SocialPanel({
  isOpen,
  onOpen,
  onClose,
}: SocialPanelProps) {
  return (
    <>
      {/* Edge tab — the desktop trigger, and a visual hint on mobile that
          there's more content to swipe to. Hides itself while the panel
          is open so it doesn't sit awkwardly behind it. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open connect and shows panel"
        style={{ writingMode: "vertical-rl" }}
        className={`fixed right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-lg border border-r-0 border-gold/40 bg-panel px-2 py-6 font-label text-[10px] uppercase tracking-[0.25em] text-gold-dim transition-all hover:px-3 hover:text-gold ${
          isOpen ? "pointer-events-none translate-x-full opacity-0" : ""
        }`}
      >
        Connect
      </button>

      {/* Backdrop — mainly for mobile, dismisses on tap outside the panel */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-void/60 backdrop-blur-sm"
        />
      )}

      {/* The panel itself */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connect and upcoming shows"
        className={`fixed right-0 top-0 z-40 h-full w-full max-w-sm border-l border-gold/30 bg-panel px-6 py-10 shadow-vinyl transition-transform duration-300 ease-out md:px-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-8 font-label text-xs uppercase tracking-[0.2em] text-gold-dim transition-colors hover:text-gold"
        >
          Close ✕
        </button>

        <div className="mt-14">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-gold-dim">
            Connect
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-gold/40 px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon />
              Instagram
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-gold/40 px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <YouTubeIcon />
              YouTube
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-walnut/60 pt-8">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-gold-dim">
            Upcoming Live Shows
          </p>
          <ul className="mt-4 space-y-3">
            {upcomingShows.map((show) => (
              <li
                key={show.date}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="font-display text-lg italic text-cream">
                  {show.date}
                </span>
                <span className="font-label text-[11px] uppercase tracking-[0.15em] text-gold-dim">
                  {show.venue}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
