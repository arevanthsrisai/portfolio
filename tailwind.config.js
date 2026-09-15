/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#05060a",
          900: "#08090f",
          850: "#0b0d14",
          800: "#10121b",
          700: "#181b27",
        },
        ink: {
          DEFAULT: "#e9ebf4",
          dim: "#99a0b6",
          faint: "#6b7291",
        },
        iris: {
          DEFAULT: "#8f8ff8",
          soft: "#b6b9ff",
          deep: "#6a6ee6",
        },
        teal: {
          DEFAULT: "#63d9c4",
          soft: "#93e9da",
          deep: "#3cb9a5",
        },
        amber: {
          DEFAULT: "#ecc27c",
          soft: "#f6d9a8",
          deep: "#d8a658",
        },
        accent: {
          DEFAULT: "#8f8ff8",
          soft: "#b6b9ff",
          deep: "#6a6ee6",
        },
        mint: "#63d9c4",
      },
      fontFamily: {
        display: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', "ui-monospace", "monospace"],
        arcade: ['"Press Start 2P"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 1, 0.5, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        450: "450ms",
        700: "700ms",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
