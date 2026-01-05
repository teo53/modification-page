/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        primary: {
          DEFAULT: '#E5C04B', // Bright Gold
          hover: '#D4AF37',
        },
        secondary: {
          DEFAULT: '#FF007F', // Pink
          hover: '#D9006C',
        },
        accent: '#1E1E1E',
        text: {
          main: '#FFFFFF',
          muted: '#CCCCCC',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
