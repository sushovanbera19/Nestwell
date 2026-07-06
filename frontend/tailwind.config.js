/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#222831', // sidebar bg, primary text
          soft: '#393E46',    // secondary dark surface / hover
        },
        teal: {
          DEFAULT: '#76ABAE', // brand accent
          deep: '#5C8F92',    // hover / pressed accent
          mist: '#CFE3E4',    // chip / highlight backgrounds
        },
        paper: '#EEEEEE',     // canvas background
        // functional status colors — used sparingly, only for rent/complaint state
        amber: { DEFAULT: '#C08A3E', soft: '#F3E4CC' },
        rose: { DEFAULT: '#B5555A', soft: '#F1D9DA' },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(34,40,49,0.04), 0 8px 20px -14px rgba(34,40,49,0.35)',
      },
    },
  },
  plugins: [],
}
