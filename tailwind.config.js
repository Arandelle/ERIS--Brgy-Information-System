/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",

  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],

  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
      },
      fontSize: {
        xxs: '0.5rem'
      },
      screens:{
       
      }
    },
  },
  fontFamily: {
    sans: ["Graphik", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },
  plugins: [
    require('flowbite/plugin'),
    
  ],
};
