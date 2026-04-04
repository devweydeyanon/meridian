import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Open Sans'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
      colors: {
        navy: {
          700: '#142d54',
          800: '#0f2035',
          900: '#0a1628',
        },
        cta: {
          primary: '#c8102e',
          hover: '#a50d24',
        },
        accent: {
          400: '#60a5fa',
          500: '#0077be',
          600: '#0066a4',
        },
        bank: {
          green: '#0f7b3f',
        },
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
