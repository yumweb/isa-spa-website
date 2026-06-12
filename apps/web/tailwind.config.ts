import type { Config } from "tailwindcss";

/** Design tokens decoded from the ISA Spa prototype. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F1E6",
        gold: { DEFAULT: "#C19A4B", deep: "#A8823A" },
        ink: { DEFAULT: "#3F3B30", soft: "#56564A" },
        sand: "#C7B89D",
        espresso: "#342A1F",
        mute: "#8E8169",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-mulish)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
