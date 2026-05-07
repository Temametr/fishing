/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color, #0f172a)',
          text: 'var(--tg-theme-text-color, #ffffff)',
          hint: 'var(--tg-theme-hint-color, #94a3b8)',
          link: 'var(--tg-theme-link-color, #00f2fe)',
          button: 'var(--tg-theme-button-color, #4facfe)',
          'button-text': 'var(--tg-theme-button-text-color, #0f172a)',
          secondary: 'var(--tg-theme-secondary-bg-color, rgba(255,255,255,0.05))',
        },
        fish: {
          peaceful: '#4ade80',
          predator: '#f87171',
        }
      }
    },
  },
  plugins: [],
}
