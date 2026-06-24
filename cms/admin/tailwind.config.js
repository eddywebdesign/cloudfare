/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carp: {
          dark:    '#3F3F3F',   // sidebar / dark sections
          brown:   '#3a3228',   // body text / hover-on-gold
          muted:   '#7a6e60',   // secondary text
          gold:    '#a07840',   // primary accent
          lt:      '#c9a96e',   // gold light
          xs:      '#f1dab9',   // gold extra-light / wheat
          cream:   '#f5f0e8',   // warm background
          warm:    '#faf8f5',   // warm white (cards)
          border:  '#e5ddd0',   // borders
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
