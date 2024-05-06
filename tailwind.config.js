/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
      },
      fontSize: {
        xxs: '0.5rem'
      }
    },
    screens: {
      sm: "360px",
      md: "480px",
      lg: "768px",
      xl: "976px",
      xxl: "1440px",
    },
  },
  fontFamily: {
    sans: ["Graphik", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },
  plugins: [],
};
