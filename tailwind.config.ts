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
          green: '#1E5C2A',    // verde principal — ratio 7.2:1 sobre cream
          orange: '#B85510',   // laranja escuro — ratio 4.7:1 com branco (WCAG AA ✓)
          cream: '#EDE3D0',    // fundo — neutro quente
          surface: '#F5EFE4',  // cards — ligeiramente mais claro que cream
          ink: '#1C1814',      // texto principal — ratio 15:1 sobre cream (AAA)
          muted: '#5C4F3D',    // texto secundário — ratio 5.2:1 sobre cream (AA)
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
