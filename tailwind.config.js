/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0A0612',
          900: '#120A24',
          800: '#1B1138',
          700: '#2A1B54',
        },
        violet: {
          50:  '#F6F3FF',
          100: '#EDE7FF',
          200: '#D9CCFF',
          300: '#BCA4FF',
          400: '#9C7BFF',
          500: '#7C3AED',
          600: '#6325CC',
          700: '#4B1AA0',
        },
        amber: {
          400: '#FBA94B',
          500: '#F58220',
          600: '#E0651F',
        },
        rose: {
          500: '#FF5C7A',
          600: '#E63E5F',
        },
        mint: {
          400: '#5EE3A6',
          500: '#1FB87A',
        },
        bone: '#FAF7F2',
        cream: '#F5F0E6',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(15,5,40,0.04), 0 8px 24px -8px rgba(76,29,149,0.12)',
        lift: '0 1px 0 0 rgba(15,5,40,0.04), 0 24px 48px -16px rgba(76,29,149,0.22)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.3)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        slideUp: 'slideUp 0.4s ease-out both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
