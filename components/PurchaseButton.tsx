"use client";

import { useEffect, useState } from "react";

interface PurchaseButtonProps {
  razorpayKeyId: string | null;
  albumTitle: string;
  artist: string;
  onPurchased?: () => void;
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const PURCHASED_KEY = "letting-go-purchased";

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No window available."));
  }
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load the Razorpay checkout script."));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

type Status = "idle" | "loading" | "error" | "purchased";

/**
 * Test-mode Razorpay purchase flow:
 *   1. POST /api/create-order  → server creates a ₹250 order
 *   2. Open Razorpay Checkout with that order
 *   3. On success, POST the three returned fields to /api/verify-payment
 *   4. Only on a verified response do we mark the album as purchased
 *
 * Per the earlier scope decision, this does NOT gate playback — the
 * album keeps playing free during early access regardless of purchase
 * status. This only tracks and confirms a real, verified purchase.
 */
export default function PurchaseButton({
  razorpayKeyId,
  albumTitle,
  artist,
  onPurchased,
}: PurchaseButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Read localStorage after mount, not during the initial render, so the
  // server-rendered HTML and the client's first render always match —
  // reading browser storage during render would cause a hydration
  // mismatch here.
  useEffect(() => {
    if (window.localStorage.getItem(PURCHASED_KEY) === "true") {
      setStatus("purchased");
    }
  }, []);

  async function handlePurchase() {
    if (!razorpayKeyId) {
      setMessage(
        "Payments aren't configured yet — add RAZORPAY_KEY_ID to the server environment."
      );
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      await loadRazorpayScript();

      const orderRes = await fetch("/api/create-order", { method: "POST" });
      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not create order.");
      }
      const order: { orderId: string; amount: number; currency: string } =
        await orderRes.json();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout script did not load.");
      }

      const checkout = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: albumTitle,
        description: `${albumTitle} — ${artist}`,
        image: "/icon.png",
        theme: { color: "#D4A574" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result: { verified: boolean } = await verifyRes.json();

            if (result.verified) {
              window.localStorage.setItem(PURCHASED_KEY, "true");
              setStatus("purchased");
              setMessage(null);
              onPurchased?.();
            } else {
              setStatus("error");
              setMessage(
                "Payment could not be verified — no purchase was recorded."
              );
            }
          } catch {
            setStatus("error");
            setMessage("Verification failed — please try again.");
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the Checkout modal without paying — just
            // return to the idle state, no error.
            setStatus((current) => (current === "loading" ? "idle" : current));
          },
        },
      });

      checkout.open();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong starting checkout. Please try again."
      );
    }
  }

  if (status === "purchased") {
    return (
      <p className="font-label text-xs uppercase tracking-[0.2em] text-gold">
        ✓ Album purchased — thank you
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handlePurchase}
        disabled={status === "loading"}
        className="rounded-full bg-gold px-6 py-2 font-label text-xs uppercase tracking-[0.2em] text-void transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
      >
        {status === "loading" ? "Opening checkout…" : "Purchase Album — ₹250"}
      </button>
      {message && (
        <p className="max-w-xs font-label text-[11px] leading-relaxed text-gold-dim">
          {message}
        </p>
      )}
    </div>
  );
}
