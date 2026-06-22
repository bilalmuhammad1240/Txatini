import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        txatini: {
          green: '#1A4230',    // verde mais fundo — mais peso, menos brilho
          orange: '#B85215',   // laranja mais queimado — menos saturado
          cream: '#E8DCCB',    // bege mais escuro e quente — muito menos reflectivo
          surface: '#F4EEE4',  // superfície dos cards — entre cream e branco
          ink: '#1E1C1A',      // texto quase-preto mais quente
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
