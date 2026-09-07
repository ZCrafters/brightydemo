/** @type {import('tailwindcss').Config} */
// Utility layer di atas globals.css yang sudah ada (preflight OFF agar tidak merusak CSS lama).
const tokens = {
  bg: "#f0f8ff",
  surface: "#ffffff",
  ink: "#1f3350",
  muted: "#5e7fa2",
  line: "#d2e3f3",
  primary: "#1864b8",
  accent: "#ff4d8d",
  "accent-dark": "#cc3d70",
  badge: "#e91e63",
  star: "#b45309",
  success: "#166534",
  danger: "#e91e63",
  "glow-1": "#d6ecff",
  "glow-2": "#e6f3fe",
  "glow-3": "#f2faff",
};

module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: tokens,
      fontFamily: {
        body: ['"Outfit"', "system-ui", "sans-serif"],
        display: ['"Cabinet Grotesk"', '"Outfit"', "system-ui", "sans-serif"],
      },
      maxWidth: { wrap: "1400px" },
      borderRadius: { card: "14px" },
      boxShadow: {
        card: "0 10px 30px -12px rgba(70, 32, 58, 0.18)",
        glow: "0 22px 44px -18px rgba(90, 40, 70, 0.45)",
      },
      keyframes: {
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { opacity: "0.55" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "float-soft": "float-soft 5s ease-in-out infinite",
        shimmer: "shimmer 1.1s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
