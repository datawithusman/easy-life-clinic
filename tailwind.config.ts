import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E7C6E",
          50: "#E8F5F3",
          100: "#C5E8E3",
          200: "#8FD0C7",
          300: "#5AB9AF",
          400: "#2EA398",
          500: "#0E7C6E",
          600: "#0B6459",
          700: "#084C44",
          800: "#05342F",
          900: "#021C1A",
        },
        accent: {
          DEFAULT: "#5A3FA8",
          50: "#EEE9F8",
          100: "#D5C9F0",
          200: "#AB93E1",
          300: "#815DD2",
          400: "#6B4ABF",
          500: "#5A3FA8",
          600: "#483286",
          700: "#362565",
          800: "#241843",
          900: "#120C22",
        },
        warning: {
          DEFAULT: "#B8680A",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#C0392B",
          light: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
