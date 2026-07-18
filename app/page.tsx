import Player from "@/components/Player";
import { album, tracks } from "@/lib/tracks";

export default function HomePage() {
  // Read on the server only. This is the public Key ID, safe to reach
  // the client — RAZORPAY_KEY_SECRET is never imported outside the
  // /api routes.
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID ?? null;

  return (
    <main className="min-h-screen bg-void">
      <Player album={album} tracks={tracks} razorpayKeyId={razorpayKeyId} />
    </main>
  );
}
