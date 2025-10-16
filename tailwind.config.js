/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#121212',
        'light': '#f0f0f0',
        'accent': '#007bff',
      },
      fontFamily: {
        // This links to the 'Space Grotesk' font imported in the original HTML
        'sans': ['Space Grotesk', 'sans-serif'],
      },
      spacing: {
        'xl': '80px',
        'header': '80px',
      },
      // Utility for the large hero section titles
      fontSize: {
        'hero': 'clamp(3rem, 6vw, 7rem)',
        'section-title': '4rem',
      },
    },
  },
  plugins: [],
}