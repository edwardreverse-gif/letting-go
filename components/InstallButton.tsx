"use client";

import { useEffect, useState } from "react";

// Chrome/Android fire this event and let us trigger the native install
// dialog. iOS Safari never fires it — there's no programmatic install
// API there, only the manual Share → "Add to Home Screen" path.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Already running as an installed app — nothing to offer.
  if (isStandalone || installed) {
    return (
      <p className="font-label text-xs uppercase tracking-[0.2em] text-gold-dim">
        ✓ Installed
      </p>
    );
  }

  if (isIOS) {
    return (
      <p className="max-w-xs font-label text-[11px] leading-relaxed text-gold-dim">
        To install: tap <span className="text-gold">•••</span>, then{" "}
        <span className="text-gold">Share</span>, then{" "}
        <span className="text-gold">“Add to Home Screen.”</span>
      </p>
    );
  }

  if (deferredPrompt) {
    return (
      <button
        type="button"
        onClick={async () => {
          await deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          if (choice.outcome === "accepted") setInstalled(true);
          setDeferredPrompt(null);
        }}
        className="rounded-full bg-gold px-6 py-2 font-label text-xs uppercase tracking-[0.2em] text-void transition-transform hover:scale-105 active:scale-95"
      >
        Install App
      </button>
    );
  }

  // Not iOS, and the browser hasn't offered an install prompt (either it
  // doesn't support one, e.g. desktop Safari/Firefox, or the event
  // hasn't fired yet) — render nothing rather than a dead button.
  return null;
}
