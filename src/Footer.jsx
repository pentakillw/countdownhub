import React from 'react';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full bg-inverse text-inverse py-8 mt-12">
      
      <div className="container mx-auto px-6 text-center">
        
        <div className="mb-4">
          <a 
            href="https://buymeacoffee.com/yourlink"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2 font-medium bg-brand-t500 text-text-on-accent rounded-lg shadow-md transition-colors duration-200 hover:bg-brand-t600"
          >
            <Heart size={20} className="mr-2" />
            Apoya el proyecto
          </a>
        </div>

        <div className="text-sm text-gray-t400 opacity-90 mb-4">
          <p>
            © {new Date().getFullYear()} ClicTimes. Todos los derechos reservados.
          </p>
          <p className="mt-2">
            Este producto utiliza la API de TMDB pero no está respaldado ni certificado por TMDB.
          </p>
        </div>
        
        {/* --- CORRECCIÓN 4: Logo TMDB con fondo blanco para visibilidad --- */}
        <a 
          href="https://www.themoviedb.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-white p-2 rounded-lg shadow-sm" // Fondo blanco explícito
        >
          <img 
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202b5685a8403934d20.svg" 
            alt="Logo de The Movie Database (TMDB)" 
            className="h-8 w-auto"
            aria-describedby="tmdb-attribution"
          />
        </a>
        <span id="tmdb-attribution" className="sr-only">Logo de The Movie Database (TMDB)</span>

      </div>
    </footer>
  );
}

export default Footer;