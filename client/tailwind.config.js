/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Geist', 'sans-serif'],
      },
      colors: {
        // Brand
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Surface tokens (used via CSS vars)
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          sunken: 'var(--surface-sunken)',
        },
        // Text tokens
        ink: {
          DEFAULT: 'var(--ink)',
          secondary: 'var(--ink-secondary)',
          muted: 'var(--ink-muted)',
          placeholder: 'var(--ink-placeholder)',
        },
        // Border
        edge: {
          DEFAULT: 'var(--edge)',
          strong: 'var(--edge-strong)',
        },
        // Note colors
        note: {
          red:    '#fecaca',
          orange: '#fed7aa',
          yellow: '#fef08a',
          green:  '#bbf7d0',
          teal:   '#99f6e4',
          blue:   '#bfdbfe',
          purple: '#e9d5ff',
          pink:   '#fbcfe8',
        },
      },
      boxShadow: {
        'sm-soft': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'md-soft': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'lg-soft': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'xl-soft': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'card': '0 0 0 1px var(--edge), 0 2px 8px rgb(0 0 0 / 0.06)',
        'card-hover': '0 0 0 1px var(--edge-strong), 0 4px 16px rgb(0 0 0 / 0.1)',
        'modal': '0 0 0 1px var(--edge), 0 24px 48px rgb(0 0 0 / 0.18)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'fade-up': 'fadeUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'slide-in-left': 'slideInLeft 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        slideInLeft: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};