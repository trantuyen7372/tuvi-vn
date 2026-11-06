import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        son: { DEFAULT: '#9b1c1c', light: '#c0392b' },
        giay: '#fbf6ec',
        muc: '#2b2118',
        vang: '#b8860b',
      },
      fontFamily: { serif: ['"Noto Serif"', 'Georgia', 'serif'] },
    },
  },
  plugins: [],
} satisfies Config;
