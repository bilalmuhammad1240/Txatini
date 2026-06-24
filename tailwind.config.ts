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
          green: '#1E5C2A',    // verde da logo real
          orange: '#E07B2A',   // laranja da logo real
          cream: '#E8DCCB',    // bege quente — fundo da loja
          surface: '#F2EAD8',  // superfície dos cards
          ink: '#1C1814',      // quase-preto quente
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
