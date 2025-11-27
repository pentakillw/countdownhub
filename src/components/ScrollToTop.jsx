import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando la ruta cambia, subimos suavemente al inicio
    window.scrollTo({
      top: 0,
      behavior: "instant" // 'instant' es mejor para cambios de página completos
    });
  }, [pathname]);

  return null;
}