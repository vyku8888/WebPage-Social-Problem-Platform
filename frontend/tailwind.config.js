/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4DA8DA',
        primaryDark: '#3A85B0',
        primaryLight: '#E8F4FA'
      }
    },
  },
  plugins: [],
}
