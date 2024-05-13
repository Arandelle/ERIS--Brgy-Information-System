/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',

  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
      },
      fontSize: {
        xxs: '0.5rem'
      },
      screens: {
        // Define your custom screen sizes here if needed
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
