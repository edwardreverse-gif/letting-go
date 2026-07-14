import { NextResponse } from "next/server";
import crypto from "crypto";

interface VerifyRequestBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      {
        verified: false,
        error: "Razorpay is not configured on this server.",
      },
      { status: 500 }
    );
  }

  let body: VerifyRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { verified: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { verified: false, error: "Missing payment fields." },
      { status: 400 }
    );
  }

  // The only trustworthy way to confirm a Razorpay payment: recompute the
  // HMAC-SHA256 signature server-side, using the secret the browser never
  // sees, and compare it to what Razorpay sent back to the client. Never
  // unlock anything based on the client's "success" callback alone —
  // that would let anyone unlock the album by POSTing fake IDs here.
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const verified = expectedSignature === razorpay_signature;

  return NextResponse.json({ verified });
}
