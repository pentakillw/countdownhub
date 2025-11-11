/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // --- ¡CORRECCIÓN! ---
    // 'colors' va aquí, al mismo nivel que 'extend'.
    // Esto REEMPLAZA la paleta de colores de Tailwind por la nuestra.
    colors: {
      // --- Escala de Grises ---
      gray: {
        't0': '#0C0D0F',   't50': '#181A1E',   't100': '#25272C',  't150': '#31343B',
        't200': '#3D414A',  't250': '#494E59',  't300': '#555B68',  't350': '#626876',
        't400': '#6E7585',  't450': '#7A8294',  't500': '#868D9E',  't550': '#9299A7',
        't600': '#9EA4B1',  't650': '#AAAFBB',  't700': '#B6BAC4',  't750': '#C2C6CE',
        't800': '#CED1D7',  't850': '#DADCE1',  't900': '#E6E7EB',  't950': '#F2F3F4',
      },
      
      // --- Colores de Marca ---
      brand: {
        't0': '#000014',   't50': '#000028',   't100': '#00013D',  't150': '#000151',
        't200': '#000165',  't250': '#000179',  't300': '#00018D',  't350': '#0002A2',
        't400': '#0002B6',  't450': '#0002CA',  't500': '#1719CF',  't550': '#2E30D4',
        't600': '#4546D8',  't650': '#5C5DDD',  't700': '#7374E2',  't750': '#8A8BE7',
        't800': '#A1A1EB',  't850': '#B8B8F0',  't900': '#CFCFF5',  't950': '#E6E6FA',
      },

      // --- Paletas Semánticas ---
      'bg-default': '#F2F3F4',
      'bg-muted': '#E6E7EB',
      'bg-subtle': '#DADCE1',
      'bg-strong': '#0C0D0F',
      'bg-inverse': '#0C0D0F',
      'bg-brand-subtle': '#CFCFF5',
      'bg-info-subtle': '#85D1F6',
      'bg-success-subtle': '#81E9AA',
      'bg-warning-subtle': '#F9BE96',
      'bg-critical-subtle': '#F6B5B6',

      'text-default': '#0C0D0F',
      'text-muted': '#31343B',
      'text-subtle': '#494E59',
      'text-strong': '#0C0D0F',
      'text-inverse': '#F2F3F4',
      'text-info': '#12A4E9',
      'text-critical': '#E84346',
      'text-warning': '#F2731D',
      'text-success': '#23C764',
      'text-on-accent': '#FFFFFF',

      'border-default': '#DADCE1',
      'border-strong': '#494E59',
      'border-inverse': '#F2F3F4',
      'border-info-strong': '#12A4E9',
      'border-critical-strong': '#E84346',
      'border-warning-strong': '#F2731D',
      'border-success-strong': '#23C764',

      'action-primary': '#000165',
      'action-primary-hover': '#000179',
      'action-primary-pressed': '#00018D',
      'action-secondary': '#3D414A',
      'action-secondary-pressed': '#494E59',
      'action-critical': '#E84346',
      'action-critical-hover': '#EE7073',
      'action-critical-pressed': '#DD1B1F',

      // --- Decorativos ---
      'deco-azul-1': '#12A4E9',
      'deco-azul-2': '#56C0F2',
      'deco-verde-1': '#23C764',
      'deco-verde-2': '#55E18D',
      'deco-neutro-1': '#494E59',
      'deco-neutro-2': '#3D414A',
      'deco-naranja-1': '#F2731D',
      'deco-naranja-2': '#F6A065',
      'deco-violeta-1': '#A152F1',
      'deco-violeta-2': '#C799F7',
      'deco-turquesa-1': '#19BAAC',
      'deco-turquesa-2': '#3BE5D6',
      'deco-rosa-1': '#E54699',
      'deco-rosa-2': '#EE89BE',

      // --- ¡CORRECCIÓN! ---
      // Añadimos 'white' y 'transparent'
      'white': '#FFFFFF',
      'transparent': 'transparent',
    },

    extend: {
      // 'fontFamily' SÍ se queda aquí, porque estamos
      // extendiendo las fuentes, no reemplazándolas.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}