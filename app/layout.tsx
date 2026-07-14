import type { Metadata, Viewport } from "next";
import { Fraunces, Jost, Inter } from "next/font/google";
import "./globals.css";

// Display face — the characterful serif used for "Letting Go" / track titles.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Label face — wide-tracked geometric sans for eyebrows, badges, UI chrome.
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
});

// Body face — plain, readable sans for running copy.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Letting Go — Edward Reverse",
  description:
    "Letting Go, an exclusive early release album by Edward Reverse. Listen as a boutique installable player, online or off.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Letting Go",
  },
};

export const viewport: Viewport = {
  themeColor: "#120D0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jost.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
