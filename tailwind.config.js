/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],

  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
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
      alef: ["alef"]
    },
  },
  
  plugins: [
    require('flowbite/plugin'), // Example plugin
  ],
};
