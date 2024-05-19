/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
        yellow: "#ffcb74",
        black: "#2f2f2f"
      },
      fontSize: {
        xxs: '0.5rem'
      },
      screens: {
        xxs: "480px"
      }
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
  },
  
  plugins: [
    require('flowbite/plugin'), // Example plugin
  ],
};
