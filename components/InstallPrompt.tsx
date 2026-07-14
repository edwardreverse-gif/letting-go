"use client";

import { useEffect, useState } from "react";

// Chrome/Android fire this event and let us trigger the native install
// dialog. iOS Safari never fires it, so we detect iOS separately and
// show manual "Add to Home Screen" instructions instead.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setIsIOS(ios && !standalone);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed || (!deferredPrompt && !isIOS)) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-20 flex items-center justify-between gap-4 rounded-xl border border-gold/30 bg-panel/95 px-4 py-3 shadow-vinyl backdrop-blur md:inset-x-auto md:right-6 md:w-96">
      <p className="font-label text-xs text-cream">
        {isIOS
          ? "Add to Home Screen: tap Share, then \u201cAdd to Home Screen.\u201d"
          : "Install Letting Go for offline listening."}
      </p>
      <div className="flex shrink-0 gap-2">
        {deferredPrompt && (
          <button
            type="button"
            onClick={async () => {
              await deferredPrompt.prompt();
              await deferredPrompt.userChoice;
              setDeferredPrompt(null);
            }}
            className="rounded-full bg-gold px-3 py-1 font-label text-xs text-void"
          >
            Install
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="rounded-full px-2 py-1 font-label text-xs text-gold-dim hover:text-gold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
