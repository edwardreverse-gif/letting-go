export {};

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  image?: string;
  theme?: { color?: string };
  prefill?: Record<string, string>;
  handler?: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayCheckoutInstance {
  open: () => void;
}

declare global {
  interface Window {
    // The Razorpay Checkout script (loaded at runtime from
    // checkout.razorpay.com) attaches this constructor globally.
    // Razorpay doesn't ship official TypeScript types for it, so this
    // is a minimal, hand-written shape covering only what we use.
    Razorpay?: new (
      options: RazorpayCheckoutOptions
    ) => RazorpayCheckoutInstance;
  }
}
