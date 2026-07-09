import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        forest: "var(--forest)",
        moss: "var(--moss)",
        bone: "var(--bone)",
        sand: "var(--sand)",
        brass: "var(--brass)",
        brassL: "var(--brassL)",
        line: "var(--line)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      borderRadius: { arch: "999px 999px 0 0" },
      maxWidth: { copy: "680px", wide: "1240px" },
    },
  },
  plugins: [],
};
export default config;
