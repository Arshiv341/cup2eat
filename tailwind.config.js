/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F4F7F5',
          100: '#E6ECE8',
          200: '#C9D7CE',
          300: '#A4BCAD',
          400: '#6C947A',
          500: '#437053',
          600: '#2A513A',
          700: '#224230',
          800: '#1B382B', // Deep forest green - Primary
          900: '#142B21',
          950: '#0C1C15',
        },
        olive: {
          500: '#3D5E48',
          600: '#2F4B38',
          700: '#233A2B',
          800: '#1A2D21',
        },
        gold: {
          50: '#FBF8F0',
          100: '#F6EEDB',
          200: '#EBDCB4',
          300: '#DEC586',
          400: '#D4AF37', // Warm golden yellow
          500: '#C8A051', // Accent gold
          600: '#B0883C',
          700: '#8A6728',
          800: '#6E511E',
        },
        ivory: '#FBF9F5',
        beige: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EDE4D5',
          300: '#DFD1BD',
          400: '#CFC0A8',
        },
        earth: {
          700: '#6B4E3B',
          800: '#543B2B',
          900: '#422C1F',
        },
        burgundy: {
          600: '#8A3A42',
          700: '#6E2D33',
          800: '#542025',
        },
        charcoal: {
          800: '#2A332E',
          900: '#1E2922',
          950: '#131B16',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
