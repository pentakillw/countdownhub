/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // <-- MODO OSCURO ACTIVADO
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // --- ¡CORRECCIÓN! ---
    // La paleta de colores AHORA usa variables CSS.
    // Esto reemplaza la paleta estática anterior.
    colors: {
      // --- Escala de Grises (Sin cambios) ---
      gray: {
        't0': '#0C0D0F',   't50': '#181A1E',   't100': '#25272C',  't150': '#31343B',
        't200': '#3D414A',  't250': '#494E59',  't300': '#555B68',  't350': '#626876',
        't400': '#6E7585',  't450': '#7A8294',  't500': '#868D9E',  't550': '#9299A7',
        't600': '#9EA4B1',  't650': '#AAAFBB',  't700': '#B6BAC4',  't750': '#C2C6CE',
        't800': '#CED1D7',  't850': '#DADCE1',  't900': '#E6E7EB',  't950': '#F2F3F4',
      },
      
      // --- Colores de Marca (Sin cambios) ---
      brand: {
        't0': '#000014',   't50': '#000028',   't100': '#00013D',  't150': '#000151',
        't200': '#000165',  't250': '#000179',  't300': '#00018D',  't350': '#0002A2',
        't400': '#0002B6',  't450': '#0002CA',  't500': '#1719CF',  't550': '#2E30D4',
        't600': '#4546D8',  't650': '#5C5DDD',  't700': '#7374E2',  't750': '#8A8BE7',
        't800': '#A1A1EB',  't850': '#B8B8F0',  't900': '#CFCFF5',  't950': '#E6E6FA',
      },

      // --- ¡PALETA SEMÁNTICA CON VARIABLES! ---
      'bg-default': 'var(--color-bg-default)',
      'bg-muted': 'var(--color-bg-muted)',
      'bg-subtle': 'var(--color-bg-subtle)',
      'bg-strong': 'var(--color-bg-strong)',
      'bg-inverse': 'var(--color-bg-inverse)',
      'bg-brand-subtle': 'var(--color-bg-brand-subtle)',
      'bg-info-subtle': 'var(--color-bg-info-subtle)',
      'bg-success-subtle': 'var(--color-bg-success-subtle)',
      'bg-warning-subtle': 'var(--color-bg-warning-subtle)',
      'bg-critical-subtle': 'var(--color-bg-critical-subtle)',

      'text-default': 'var(--color-text-default)',
      'text-muted': 'var(--color-text-muted)',
      'text-subtle': 'var(--color-text-subtle)',
      'text-strong': 'var(--color-text-strong)',
      'text-inverse': 'var(--color-text-inverse)',
      'text-info': 'var(--color-text-info)',
      'text-critical': 'var(--color-text-critical)',
      'text-warning': 'var(--color-text-warning)',
      'text-success': 'var(--color-text-success)',
      'text-on-accent': 'var(--color-text-on-accent)',

      'border-default': 'var(--color-border-default)',
      'border-strong': 'var(--color-border-strong)',
      'border-inverse': 'var(--color-border-inverse)',
      'border-info-strong': 'var(--color-border-info-strong)',
      'border-critical-strong': 'var(--color-border-critical-strong)',
      'border-warning-strong': 'var(--color-border-warning-strong)',
      'border-success-strong': 'var(--color-border-success-strong)',

      'action-primary': 'var(--color-action-primary)',
      'action-primary-hover': 'var(--color-action-primary-hover)',
      'action-primary-pressed': 'var(--color-action-primary-pressed)',
      'action-secondary': 'var(--color-action-secondary)',
      'action-secondary-pressed': 'var(--color-action-secondary-pressed)',
      'action-critical': 'var(--color-action-critical)',
      'action-critical-hover': 'var(--color-action-critical-hover)',
      'action-critical-pressed': 'var(--color-action-critical-pressed)',

      // --- Decorativos (Sin cambios) ---
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

      'white': '#FFFFFF',
      'transparent': 'transparent',
    },

    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // --- ¡ERROR CORREGIDO! ---
      // El bloque 'colors' conflictivo que estaba aquí
      // ha sido eliminado.
    },
  },
  plugins: [],
}