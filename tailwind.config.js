/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#f4f1e8',
        'cthulhu-dark': '#1a1a1a',
        'cthulhu-red': '#8b0000',
        'cthulhu-green': {
          50: '#f0f5f0',
          100: '#e8f2e8',
          200: '#c7d2cc',
          300: '#b5c7b5',
          400: '#6b8559',
          500: '#4a6b3a',
          600: '#2d4a22',
          700: '#1f3317',
          800: '#162712',
          900: '#0d1b0c',
        },
        'cthulhu-yellow': {
          50: '#faf8f0',
          100: '#f5f1e3',
          200: '#ede4c7',
          300: '#e3d4a8',
          400: '#d4c085',
          500: '#c5a962',
          600: '#b8944a',
          700: '#9a7a3a',
          800: '#7d6230',
          900: '#5c4622',
        },
        'cthulhu-brown': '#8b4513',
        'eldritch-purple': '#4b0082',
        'madness-yellow': '#ffd700',
      },
      fontFamily: {
        'gothic': ['Georgia', 'Times New Roman', 'serif'],
        'manuscript': ['Garamond', 'Georgia', 'serif'],
      },
      screens: {
        'tablet': '768px',
        'tablet-lg': '1024px',
      },
      boxShadow: {
        'eldritch': '0 10px 15px -3px rgba(139, 0, 0, 0.1), 0 4px 6px -2px rgba(139, 0, 0, 0.05)',
        'ancient': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}