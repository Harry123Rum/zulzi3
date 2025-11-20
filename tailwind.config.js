/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.jsx",
    "./resources/**/*.js",
    "./resources/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#BBDEFF',
          DEFAULT: '#5CBCE2',
          dark: '#0C4371',
        },
        neutral: {
          white: '#FAFAFA',
          light: '#E1E3E7',
          gray: '#7C7C7C',       // <- Ini yang kamu pakai: text-neutral-gray
        },
        gradient: {
          start: '#EFF6FF',
          end: '#ECFEFF',
        },
      }
    },
  },
  plugins: [],
};
