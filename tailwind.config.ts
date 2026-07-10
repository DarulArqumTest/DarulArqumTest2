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
        da: {
          bg: "rgb(var(--da-bg) / <alpha-value>)",
          bg2: "rgb(var(--da-bg2) / <alpha-value>)",
          modal: "rgb(var(--da-modal) / <alpha-value>)",
          gold: "rgb(var(--da-gold) / <alpha-value>)",
          goldL: "rgb(var(--da-goldL) / <alpha-value>)",
          cream: "rgb(var(--da-cream) / <alpha-value>)",
          mint: "rgb(var(--da-mint) / <alpha-value>)",
          kids: "rgb(var(--da-kids) / <alpha-value>)",
          blue: "rgb(var(--da-blue) / <alpha-value>)",
          orange: "rgb(var(--da-orange) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
        daDisplay: ["var(--font-da-display)", "Georgia", "serif"],
        daBody: ["var(--font-da-body)", "system-ui", "sans-serif"],
      },
      borderRadius: { arch: "999px 999px 0 0" },
      maxWidth: { copy: "680px", wide: "1240px" },
    },
  },
  plugins: [],
};
export default config;
