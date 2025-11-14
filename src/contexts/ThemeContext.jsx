import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Definir el tipo de tema (ligero, oscuro, o según el sistema)
const THEME_KEY = 'theme';
const ThemeContext = createContext(undefined);

/**
 * Proveedor de Tema
 * Este componente envuelve tu aplicación y provee el estado del tema.
 */
export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 2. Intentar leer el tema guardado en localStorage
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    // 3. ¡CAMBIO! Si no hay nada, usar 'light' como predeterminado
    return 'light'; // Antes era 'system'
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // 4. Añadir o quitar la clase "dark" del tag <html>
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    // 5. Guardar la preferencia (excepto si es 'system')
    if (theme === 'dark' || theme === 'light') {
      localStorage.setItem(THEME_KEY, theme);
    } else {
      localStorage.removeItem(THEME_KEY);
    }
  }, [theme]);

  // 6. Escuchar cambios en la preferencia del sistema (si el tema es 'system')
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Solo actualiza si el usuario está en modo 'system'
      if (theme === 'system') {
        const newIsDark = mediaQuery.matches;
        const root = window.document.documentElement;
        root.classList.remove(newIsDark ? 'light' : 'dark');
        root.classList.add(newIsDark ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    // Damos una función para cambiar el tema
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook personalizado
 * Esto nos permite usar `const { theme, setTheme } = useTheme();`
 * en cualquier componente.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}