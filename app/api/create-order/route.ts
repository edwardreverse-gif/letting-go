import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const ALBUM_PRICE_PAISE = 25000; // ₹250 — the album's one and only price.

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error:
          "Razorpay is not configured on this server (missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).",
      },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount: ALBUM_PRICE_PAISE,
      currency: "INR",
      receipt: `letting-go-${Date.now()}`,
    });

    // Only what the client needs to open Checkout — nothing else from
    // the order object is exposed.
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: "Could not create order." },
      { status: 500 }
    );
  }
}
