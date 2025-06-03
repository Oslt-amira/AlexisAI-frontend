import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        purple: {
          100: "#FEFCFE",
          200: "#FDFAFF",
          300: "#F9F1FE",
          400: "#F3E7FC",
          500: "#EDDBF9",
          600: "#E3CCF4",
          700: "#D3B4ED",
          800: "#BE93E4",
          900: "#8E4EC6",
          1000: "#8445BC",
          1100: "#793AAF",
          1200: "#402060",
        },
        mauve: {
          100: "#FDFCFD",
          200: "#FAF9FB",
          300: "#F3F1F5",
          400: "#ECEAEF",
          500: "#E6E3E9",
          600: "#DFDCE3",
          700: "#D5D3DB",
          800: "#BCBAC7",
          900: "#8E8C99",
          1000: "#817F8B",
          1100: "#65636D",
          1200: "#211F26",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xl: "0px 10px 19px -3px rgba(0, 0, 0, 0.05)",
        tooltip: "0px 1px 4px rgba(33, 31, 38, 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "image-glow": {
          "0%": {
            opacity: "0",
            "animation-timing-function": "cubic-bezier(0.74, 0.25, 0.76, 1)",
          },
          "10%": {
            opacity: "0.7",
            "animation-timing-function": "cubic-bezier(0.12, 0.01, 0.08, 0.99)",
          },
          "100%": {
            opacity: "0.4",
          },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "none" },
        },
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "bounce-load": {
          "50%": { transform: "translateY(0%)" },
          "0%,100%": { transform: "translateY(-3%)" },
        },
        "fade-up-sm": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "none", opacity: "1" },
        },
        transition: {
          from: { opacity: "0", height: "0vh" },
          to: { opacity: "1", height: "60vh" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "image-glow": "image-glow 4100ms 600ms ease-out forwards",
        "fade-in": "fade-in 1000ms var(--animation-delay, 0ms) ease forwards",
        "fade-up": "fade-up 1000ms var(--animation-delay, 0ms) ease forwards",
        shimmer: "shimmer 8s infinite",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "bounce-load": "bounce-load 1.4s infinite ease-in-out",
        "fade-up-sm": "fade-up-sm 0.5s var(--animation-delay, 0ms) ease forwards",
        transition: "transition 0.5s ease-in-out",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
