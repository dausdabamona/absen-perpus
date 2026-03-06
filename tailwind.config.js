/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3fa',
          100: '#b3daf0',
          200: '#80c1e6',
          300: '#4da8dc',
          400: '#268fd2',
          500: '#0077B6',
          600: '#006a9e',
          700: '#005580',
          800: '#004062',
          900: '#002b44',
        },
        accent: {
          50: '#fff4e6',
          100: '#ffdeb3',
          200: '#ffc880',
          300: '#ffb24d',
          400: '#f99726',
          500: '#F77F00',
          600: '#d66e00',
          700: '#b55d00',
          800: '#944c00',
          900: '#733b00',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
