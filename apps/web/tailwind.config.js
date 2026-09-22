/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          50:  'hsl(221,100%,97%)',
          100: 'hsl(221,96%,92%)',
          200: 'hsl(221,93%,83%)',
          300: 'hsl(221,90%,72%)',
          400: 'hsl(221,87%,61%)',
          500: 'hsl(221,83%,53%)',
          600: 'hsl(221,80%,46%)',
          700: 'hsl(221,78%,39%)',
          800: 'hsl(221,75%,32%)',
          900: 'hsl(221,72%,25%)',
        },
        surface: {
          50:  'hsl(210,20%,99%)',
          100: 'hsl(210,18%,97%)',
          200: 'hsl(210,16%,94%)',
          300: 'hsl(210,14%,89%)',
          400: 'hsl(210,12%,80%)',
          500: 'hsl(210,10%,70%)',
          600: 'hsl(210,10%,55%)',
          700: 'hsl(210,12%,40%)',
          800: 'hsl(210,14%,28%)',
          900: 'hsl(210,18%,16%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:   ['0.75rem',  { lineHeight: '1.125rem' }],
        sm:   ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem',     { lineHeight: '1.625rem' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl':['1.5rem',   { lineHeight: '2rem' }],
        '3xl':['1.875rem', { lineHeight: '2.375rem' }],
        '4xl':['2.25rem',  { lineHeight: '2.75rem' }],
        '5xl':['3rem',     { lineHeight: '3.5rem' }],
        '6xl':['3.75rem',  { lineHeight: '4.25rem' }],
        '7xl':['4.5rem',   { lineHeight: '5rem' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(16,24,40,0.04)',
        'soft-sm': '0 1px 3px 0 rgba(16,24,40,0.06), 0 1px 2px -1px rgba(16,24,40,0.04)',
        'soft':    '0 4px 8px -2px rgba(16,24,40,0.06), 0 2px 4px -2px rgba(16,24,40,0.04)',
        'soft-md': '0 8px 16px -4px rgba(16,24,40,0.08), 0 4px 8px -4px rgba(16,24,40,0.04)',
        'soft-lg': '0 12px 24px -6px rgba(16,24,40,0.10), 0 6px 12px -6px rgba(16,24,40,0.06)',
        'soft-xl': '0 20px 40px -8px rgba(16,24,40,0.12), 0 8px 16px -8px rgba(16,24,40,0.08)',
        'brand':   '0 4px 14px 0 rgba(66,99,235,0.25)',
        'brand-lg':'0 8px 30px 0 rgba(66,99,235,0.30)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, hsl(221,100%,97%) 0%, hsl(240,100%,99%) 50%, hsl(260,100%,98%) 100%)',
        'brand-gradient': 'linear-gradient(135deg, hsl(221,83%,53%) 0%, hsl(250,80%,60%) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(249,250,251,0.6) 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsl(221,100%,95%) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(250,100%,97%) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(200,100%,97%) 0px, transparent 50%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(66,99,235,0.4)' },
          '70%':  { transform: 'scale(1)',    boxShadow: '0 0 0 10px rgba(66,99,235,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(66,99,235,0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-in':         'fade-in 0.4s ease-out',
        'fade-up':         'fade-up 0.5s ease-out',
        'slide-in-right':  'slide-in-right 0.4s ease-out',
        'scale-in':        'scale-in 0.3s ease-out',
        'shimmer':         'shimmer 2s linear infinite',
        'pulse-ring':      'pulse-ring 2s cubic-bezier(0.455,0.030,0.515,0.955) infinite',
        'float':           'float 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
