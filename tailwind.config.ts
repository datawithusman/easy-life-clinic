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
        gold: {
          DEFAULT: "#c9a968",
          50: "#fdf8ed",
          100: "#f9edca",
          200: "#f2d98e",
          300: "#e8c355",
          400: "#ddb030",
          500: "#c9a968",
          600: "#a88540",
          700: "#836530",
          800: "#5e4720",
          900: "#3d2e0a",
        },
        forest: {
          DEFAULT: "#060f0e",
          50: "#f0faf9",
          100: "#ccefec",
          200: "#99dfd9",
          300: "#66cfc6",
          400: "#33bfb3",
          500: "#14a99e",
          600: "#0f8880",
          700: "#0a6761",
          800: "#064643",
          900: "#032421",
          950: "#060f0e",
        },
        ivory: {
          DEFAULT: "#f5f0e8",
          50: "#fefcf9",
          100: "#fdf8f2",
          200: "#f9f0e2",
          300: "#f5f0e8",
          400: "#ede5d5",
          500: "#e0d5c0",
          600: "#c8bc9f",
          700: "#a89a7c",
          800: "#857a5e",
          900: "#5c5240",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-22px) scale(1.04)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(18px) scale(0.97)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        shimmerDark: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 8s ease-in-out infinite",
        "float-slow": "floatSlow 12s ease-in-out infinite",
        "float-reverse": "floatReverse 10s ease-in-out infinite",
        "shimmer-dark": "shimmerDark 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
