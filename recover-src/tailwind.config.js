/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./public/index.html"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"',
          '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'system-ui', 'sans-serif',
        ],
        rounded: [
          '"SF Pro Rounded"', 'ui-rounded', '"Hiragino Maru Gothic ProN"',
          '"Segoe UI"', 'system-ui', 'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#eef6ff', 100: '#d9ecff', 200: '#bcdcff', 300: '#8ec4ff',
          400: '#59a1ff', 500: '#337dff', 600: '#1b5ef5', 700: '#1449e1',
          800: '#173db6', 900: '#19388f', 950: '#142457',
        },
        mint: {
          400: '#34e0a1', 500: '#12c98a', 600: '#06a874',
        },
      },
      borderRadius: {
        '4xl': '2rem', '5xl': '2.5rem',
      },
      // Fill in the opacity steps we use that aren't in the default scale,
      // so color/opacity utilities like bg-black/8 compile correctly.
      opacity: {
        2: '0.02', 4: '0.04', 6: '0.06', 8: '0.08', 12: '0.12',
        14: '0.14', 15: '0.15', 18: '0.18', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(17, 34, 68, 0.12)',
        'glass-lg': '0 20px 60px rgba(17, 34, 68, 0.18)',
        ring: '0 6px 20px rgba(51, 125, 255, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
