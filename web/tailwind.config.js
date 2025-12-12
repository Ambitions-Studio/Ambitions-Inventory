/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'fhd': '1920px',
      '2k': '2560px',
    },
    extend: {
      colors: {
        'ambitions': {
          'primary': '#1e293b',
          'secondary': '#374151',
          'accent': '#60a5fa',
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
