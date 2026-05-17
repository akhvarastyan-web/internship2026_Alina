/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        base: ['14px', { lineHeight: '1', letterSpacing: '0', fontWeight: '500' }],
        xs:   ['12px', { lineHeight: '24px', fontWeight: '400' }],
        s:    ['14px', { lineHeight: '24px', fontWeight: '400' }],
        l:    ['16px', { lineHeight: '24px', fontWeight: '700' }],
        xl:   ['24px', { lineHeight: '56px', fontWeight: '700' }],
      },
      colors: {
        bg: {
          main:    '#ffffff',
          soft:    '#fcfcfc',
          element: '#f3f3f3',
        },
        border: {
          light: '#ededed',
          input: '#dbdada',
        },
        text: {
          primary:     '#161616',
          secondary:   '#878787',
          placeholder: '#a0b1a5',
        },
        accent: {
          DEFAULT: '#168b6c',
          hover:   '#1fb28b',
          soft:    '#edffef',
        },
        button: {
          active: '#0f654e',
          disabled: '#dbdada',
        },
        error: {
          DEFAULT: '#e95a54',
          soft:    '#ef837f',
          bold:    '#d3221b',
        },
        warning: '#f1c219',

      },
    },
  },
  plugins: [],
};
