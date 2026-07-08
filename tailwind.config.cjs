/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Verde principal da marca
        verdemoikato: {
          50: '#f3fbf6',
          100: '#e6f7ee',
          200: '#ccefdc',
          300: '#b3e6c9',
          400: '#80d09a',
          DEFAULT: '#2A6F46',
          600: '#235b36',
          700: '#1a4328',
          800: '#123018',
          900: '#0b1d0c'
        },
        // Dourado (capim dourado)
        amarelomoikato: {
          50: '#fff9ec',
          100: '#fff3d9',
          200: '#ffebad',
          300: '#ffe183',
          400: '#ffd24d',
          DEFAULT: '#D4AF37',
          600: '#a07f29',
          700: '#6e551c',
          800: '#493814',
          900: '#2b220c'
        },
        // Fundo areia / Cerrado
        areia: {
          50: '#fdfaf4',
          100: '#faf4e8',
          200: '#f7efe1',
          300: '#efe2c9',
          400: '#e3cfa6',
          DEFAULT: '#F7EFE1',
          600: '#cbb585',
          700: '#a8915f'
        },
        // Terracota — calor brasileiro
        terra: {
          50: '#fbf1ec',
          100: '#f4ddd0',
          200: '#e8bda6',
          300: '#db9b7a',
          400: '#cb7d57',
          DEFAULT: '#B5654A',
          600: '#9a513a',
          700: '#7a3f2e'
        }
      }
    }
  },
  plugins: []
};
