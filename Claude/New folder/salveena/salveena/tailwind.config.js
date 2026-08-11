/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: '#14181c',
        inksoft: '#4b5157',
        cream: '#f4efe4',
        paper: '#fffdf8',
        brass: '#c9a227',
        brassdeep: '#9c7b14',
        line: '#d9d2c2',
        flaggreen: '#046a38',
        flagred: '#c8102e',
      },
      fontFamily: {
        display: ['Fraunces', 'Noto Serif Bengali', 'serif'],
        bndisplay: ['Noto Serif Bengali', 'Fraunces', 'serif'],
        body: ['Hind Siliguri', 'Inter', 'sans-serif'],
        utility: ['Inter', 'Hind Siliguri', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
