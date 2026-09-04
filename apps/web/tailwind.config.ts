import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      colors: {
        canvas: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F1F5F9',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#4F46E5',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          600: '#16A34A',
          700: '#15803D',
          DEFAULT: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          600: '#D97706',
          700: '#B45309',
          DEFAULT: '#D97706',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          600: '#DC2626',
          700: '#B91C1C',
          DEFAULT: '#DC2626',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          600: '#2563EB',
          DEFAULT: '#2563EB',
        },
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'modal': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'elevated': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'popover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
