/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#424C61', // Dark blue - Primary brand color
          light: '#5A6578',
          dark: '#2F3644',
        },
        secondary: {
          DEFAULT: '#954535', // Brown - Secondary brand color
          light: '#B85A45',
          dark: '#7A3828',
        },
        font: {
          primary: '#121212', // Near black for main text
        },
        stroke: '#F5F3ED', // Light cream/ivory for strokes
        shadow: '#E7E7E7', // Light gray for shadows
      },
      fontFamily: {
        sans: ['Inknut Antiqua', 'Galea', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        arabic: ['Cairo', 'Amiri', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

