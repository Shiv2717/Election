/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        },
        accent: {
          saffron: '#ff9933',
          green: '#138808',
          blue: '#000080',
          'blue-light': '#3b82f6',
        },
        border: {
          DEFAULT: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
