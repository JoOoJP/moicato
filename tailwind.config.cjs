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
        // Verde principal da marca — oficial do manual de marca (#033f00).
        // 600+ são variações mais escuras pra hover; já nasce quase preto,
        // então o degradê abaixo dele é curto de propósito.
        verdemoikato: {
          50: '#eef5ec',
          100: '#d9ead4',
          200: '#b3d5aa',
          300: '#85ba78',
          400: '#4f9647',
          DEFAULT: '#033f00',
          600: '#022f00',
          700: '#012200',
          800: '#011500',
          900: '#000900'
        },
        // Dourado (capim dourado) — oficial do manual: DEFAULT #d5a84c, 700 #b48332.
        amarelomoikato: {
          50: '#fbf3e3',
          100: '#f7e7c8',
          200: '#eecf98',
          300: '#e2b56c',
          400: '#dab04e',
          DEFAULT: '#d5a84c',
          600: '#c2953f',
          700: '#b48332',
          800: '#8a6527',
          900: '#5f451b'
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
        },
        // Verde-floresta escuro das seções cinematográficas (ref. editorial).
        floresta: {
          50: '#eef1ea', 100: '#d6ddcd', 200: '#aebd9f', 300: '#7e916b',
          400: '#556347', DEFAULT: '#2b3522', 600: '#222a1b', 700: '#1a2015',
          800: '#12160e', 900: '#0b0e08'
        },
        // Creme "osso" — fundo claro editorial, mais quente que branco.
        osso: { DEFAULT: '#f2ede1', 100: '#f6f1e7', 200: '#ece4d3' }
      }
    }
  },
  plugins: []
};
