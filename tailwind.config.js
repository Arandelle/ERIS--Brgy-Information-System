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
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        orange: {
          50: '#ffe9e5',
          100: '#ffd3cc',
          200: '#ffa799',
          300: '#ff7c66',
          400: '#ff5033', // Slightly lighter than #FF5733
          500: '#ff5733', // Your main color
          600: '#e64e2e',
          700: '#cc4529',
          800: '#b33b24',
          900: '#99321f',
        },
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
