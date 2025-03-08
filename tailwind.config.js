/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        bgColorChange: "bgColorChange 3s infinite alternate",
      },
      keyframes: {
        bgColorChange: {
          "0%": { backgroundColor: "#FFFCDD" }, // Red
          "25%": { backgroundColor: "#A7860D" }, // Blue
          "50%": { backgroundColor: "#729E0D" }, // Blue
          "75%": { backgroundColor: "#B63464" }, // Blue
          "100%": { backgroundColor: "#0C5B75" }, // Green
        },
      },
    },
  },
  plugins: [],
};
