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
          green: '#1F4D36', // verde escuro - confiança
          orange: '#D9641E', // laranja queimado - comida, calor
          cream: '#F5EDE0', // bege claro - base caseira
          ink: '#262220', // preto suave - texto
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
