/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#0f0f1a",
        "bg-panel": "#1a1a2e",
        "accent-red": "#e94560",
        "accent-blue": "#4da6ff",
        "accent-gold": "#ffd700",
        "accent-purple": "#6a0dad",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'Barlow Condensed'", "sans-serif"],
        mono: ["'Share Tech Mono'", "monospace"],
      },
      keyframes: {
        shake: {
          "0%":   { transform: "translate(1px,1px) rotate(0deg)" },
          "25%":  { transform: "translate(-2px,-2px) rotate(-1deg)" },
          "50%":  { transform: "translate(-3px,0px) rotate(1deg)" },
          "75%":  { transform: "translate(3px,2px) rotate(0deg)" },
          "100%": { transform: "translate(1px,-1px) rotate(-1deg)" },
        },
        fadeIn: {
          "0%":   { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(77,166,255,0.4)" },
          "50%":       { boxShadow: "0 0 24px rgba(77,166,255,0.9)" },
        },
      },
      animation: {
        shake: "shake 0.3s ease-in-out",
        fadeIn: "fadeIn 0.25s ease-out",
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
