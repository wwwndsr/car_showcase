/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-100": "#2B2C35",
        "primary-blue": "#2B59FF",       // основной синий
        "primary-blue-100": "#F5F8FF",   // светлый синий
        "secondary-orange": "#f79761",
        "light-white": "rgba(59,60,152,0.03)",
        "light-white-100": "rgba(59,60,152,0.02)",
        "grey": "#747A88",
      },
      backgroundImage: {
        'pattern': "url('/pattern.png')",
        'hero-bg': "url('/hero-bg.png')",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
