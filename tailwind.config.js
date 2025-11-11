/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Busca clases en todos los archivos de React
  ],
  theme: {
    extend: {
      // --- NUEVA PALETA DE COLORES "ClicTimes" ---
      colors: {
        'brand-blue': '#0002CA',     // Azul Duke
        'brand-green': '#0A4747',    // Verde Brasil
        'brand-white': '#F9FBFC',    // Blanco Zinc (Fondo principal)
        'brand-text': '#322D30',     // Gris Foca (Texto principal)
        'brand-gray': '#5A5B5A',     // Hierro (Texto secundario/bordes)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Usamos la fuente Inter como principal
      },
    },
  },
  plugins: [],
}