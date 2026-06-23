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
          green: '#0F2A1E',    // verde muito escuro — profundo, evoca noite de cozinha
          orange: '#E07B2A',   // laranja-açafrão — mais dourado, menos néon
          cream: '#E8DCCB',    // bege quente — menos reflectivo
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
