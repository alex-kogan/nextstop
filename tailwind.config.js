/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ink: "#0f0e0d",
        chalk: "#f5f2ee",
        "page-bg": "#f5f5f5",
        transit: "#0070b4",
        amber: {
          DEFAULT: "#f59e0b",
          light: "#fde68a",
        },
        rail: "#1c1917",
        muted: "#78716c",
        border: "#e7e3de",
      },
      animation: {
        "slide-in": "slideIn 0.4s ease forwards",
        "fade-up": "fadeUp 0.5s ease forwards",
        pulse_slow: "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
