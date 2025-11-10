/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Busca clases en todos los archivos de React
  ],
  theme: {
    extend: {
      // Aquí podemos definir la paleta de colores del proyecto
      colors: {
        'brand-primary': '#6D28D9', // Un morado principal
        'brand-secondary': '#1F2937', // Un gris oscuro
        'brand-accent': '#10B981', // Un verde para acentos
        'brand-light': '#F3F4F6', // Un fondo claro
        'brand-dark': '#111827', // Un fondo oscuro (nuestro principal)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Usamos la fuente Inter como principal
      },
    },
  },
  plugins: [],
}