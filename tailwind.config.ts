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
          100: "#FDFDFC",
          200: "#FAFAF9",
          300: "#F4F4F2",
          400: "#EEEFEB",
          500: "#E6E8E1",
          600: "#DADED4",
          700: "#C7CDBF",
          800: "#9DA994",
          900: "#09231B",
          1000: "#182F23",
          1100: "#33462C",
          1200: "#0B1710",
        },
        mauve: {
          100: "#FCFCFB",
          200: "#F7F7F5",
          300: "#F1F1EF",
          400: "#EAEAE7",
          500: "#E3E3DF",
          600: "#D9D9D5",
          700: "#CDCDC7",
          800: "#B0B0A9",
          900: "#91918A",
          1000: "#797971",
          1100: "#60605B",
          1200: "#1A1A18",
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
        "fade-up-sm":
          "fade-up-sm 0.5s var(--animation-delay, 0ms) ease forwards",
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
