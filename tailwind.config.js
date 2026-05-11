/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        siddhi: {
          saffron: "#FF9933",
          gold: "#D4AF37",
          black: "#0A0A0A",
          ivory: "#FFF8E7",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
        sanskrit: ["Tiro Devanagari Sanskrit", "serif"],
      },
    },
  },
  plugins: [],
};
