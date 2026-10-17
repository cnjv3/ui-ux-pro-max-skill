import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050706",
        forest: "#10241B",
        moss: "#526B4C",
        bone: "#F0F2EB",
        mineral: "#A7ADA5",
        lime: "#B8E64A",
      },
      fontFamily: {
        display: ['"Manrope Variable"', "Manrope", "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.22em",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
