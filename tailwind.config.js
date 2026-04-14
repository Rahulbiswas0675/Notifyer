/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // Light slate background
        primary: '#2563eb',    // Primary blue
        card: '#ffffff'
      }
    },
  },
  plugins: [],
}
