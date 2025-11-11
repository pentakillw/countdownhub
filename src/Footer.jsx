import React from 'react';
import { Heart } from 'lucide-react'; // Importamos el ícono de corazón

// Este es el componente Footer (pie de página)
function Footer() {
  return (
    // Fondo oscuro (Gris Foca) y texto claro (Blanco Zinc)
    <footer className="w-full bg-brand-text text-brand-white py-8">
      
      {/* 'container mx-auto' = Centra el contenido */}
      <div className="container mx-auto px-6 text-center">
        
        {/* Enlace de Donación (visible) */}
        <div className="mb-4">
          <a 
            href="https://buymeacoffee.com/yourlink" // <-- ¡Recuerda cambiar este enlace!
            target="_blank" 
            rel="noopener noreferrer"
            // Botón con el color Verde Brasil
            className="inline-flex items-center justify-center px-5 py-2 font-medium bg-brand-green text-white rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
          >
            <Heart size={20} className="mr-2" />
            Apoya el proyecto
          </a>
        </div>

        {/* Texto de Atribución y Copyright */}
        <div className="text-sm opacity-70 mb-4">
          <p>
            © {new Date().getFullYear()} ClicTimes. Todos los derechos reservados.
          </p>
          {/* Atribución obligatoria de TMDB */}
          <p className="mt-2">
            Este producto utiliza la API de TMDB pero no está respaldado ni certificado por TMDB.
          </p>
        </div>
        
        {/* Logo de TMDB (obligatorio) */}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202b5685a8403934d20.svg" 
            alt="Logo de The Movie Database (TMDB)" 
            className="h-10 w-auto mx-auto"
            // Damos la atribución explícita
            aria-describedby="tmdb-attribution"
          />
        </a>
        <span id="tmdb-attribution" className="sr-only">Logo de The Movie Database (TMDB)</span>

      </div>
    </footer>
  );
}

export default Footer;