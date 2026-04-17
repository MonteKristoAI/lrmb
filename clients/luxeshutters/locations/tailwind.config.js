/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './dist/**/*.html',
    './build.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3472b0', foreground: '#f2f5f7' },
        accent: { DEFAULT: '#d97a1e', foreground: '#f2f5f7' },
        foreground: '#1d2939',
        background: '#f2f5f7',
        card: { DEFAULT: '#fafcfd', foreground: '#1d2939' },
        muted: { DEFAULT: '#e8ecf0', foreground: '#6b7b8a' },
        secondary: { DEFAULT: '#e5e9ed', foreground: '#1d2939' },
        border: '#d5dbe1',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(52,114,176,0.08), 0 4px 6px -4px rgba(52,114,176,0.05)',
        card: '0 4px 25px -5px rgba(29,41,57,0.06), 0 8px 10px -6px rgba(29,41,57,0.04)',
        elevated: '0 10px 40px -10px rgba(29,41,57,0.12), 0 4px 15px -5px rgba(29,41,57,0.06)',
      },
    },
  },
  plugins: [],
};
