/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Branding Colors
        jurisBlue: '#0d233a', 
        jurisTeal: '#00a896',
        jurisOrange: '#e07a5f',

        // Custom Warm Whites & Light Backdrops
        jurisMilk: '#fdfbf7',     // Ultra-clean milk white with a tiny hint of warmth (Great for chat bubbles/cards)
        jurisCream: '#f7f4eb',    // Softer cream tone (Perfect for the main screen background)
        jurisSoftGray: '#eef0f2', // Neutral soft divider or chat sidebar accent background
      }
    },
  },
  plugins: [],
}