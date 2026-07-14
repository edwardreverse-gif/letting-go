import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens pulled from the album artwork — a dark walnut
        // guitar body with warm gold string-and-peg hardware.
        void: "#120D0A",       // page background, near-black warm brown
        panel: "#1F1712",      // raised surface (cards, player bar)
        walnut: "#3D2B1F",     // wood-grain accent / borders
        gold: {
          DEFAULT: "#D4A574",  // primary accent — matches cover title color
          bright: "#E8C48A",   // hover / active highlight
          dim: "#8A7358",      // muted gold for secondary text
        },
        cream: "#F0E6D6",      // primary light text
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        label: ["var(--font-jost)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "wood-grain":
          "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 40%), radial-gradient(120% 80% at 50% -10%, rgba(212,165,116,0.12), transparent 60%)",
      },
      boxShadow: {
        vinyl: "0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
