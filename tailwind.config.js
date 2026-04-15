/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: '#000000',
        primary: '#ff0000', // Diagnostic Red
        card: '#111111',
        borderTech: '#27272a',
        textMain: '#ffffff',
        textMuted: '#a1a1aa'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'speed-spin': 'spin 0.5s linear infinite',
      }
    },
  },
  plugins: [],
}
