/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Call of Cthulhu themed colors
      colors: {
        'cthulhu-dark': '#1a1a1a',
        'cthulhu-green': '#2d5016',
        'cthulhu-gold': '#8b7355',
        'parchment': '#f4f1e8',
        'ink': '#2c2c2c',
        'ancient-red': '#8B0000',
        'deep-green': '#006400',
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'gothic': ['Cinzel', 'serif'],
      },
      screens: {
        'tablet': '768px',
        'android-tablet': { 'min': '768px', 'max': '1024px' },
      }
    },
  },
  plugins: [],
}