import React from 'react';
// Importamos los íconos que usaremos
import { Coffee, DatabaseZap } from 'lucide-react';

// Este es el componente Footer (pie de página)
function Footer() {
  return (
    <footer className="w-full bg-brand-secondary py-8 border-t border-gray-700">
      <div className="container mx-auto px-6">
        
        {/* --- Sección de Donación --- */}
        <div className="text-center mb-6">
          <a
            href="https://www.buymeacoffee.com/tu-usuario" // <-- ¡Cambia esto por tu enlace real!
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <Coffee className="w-5 h-5 mr-2" />
            <span>Apoya este proyecto</span>
          </a>
          <p className="text-sm text-brand-light opacity-75 mt-3">
            CountDownHub es un proyecto gratuito. ¡Tu apoyo nos ayuda a mantenerlo!
          </p>
        </div>

        {/* --- Sección de Atribución de TMDB (OBLIGATORIO) --- */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left border-t border-gray-700 pt-6">
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="mb-4 md:mb-0 md:mr-4">
            {/* 1. Usamos el logo oficial de TMDB */}
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="The Movie Database (TMDB)"
              className="h-6"
            />
          </a>
          {/* 2. Usamos el texto de atribución legal */}
          <p className="text-xs text-brand-light opacity-60 max-w-md">
            Este sitio web utiliza TMDB y las API de TMDB, pero no está respaldado, 
            certificado ni aprobado de ninguna otra manera por TMDB.
          </p>
        </div>
        
        {/* --- Copyright --- */}
        <div className="text-center text-sm text-brand-light opacity-75 mt-6 pt-6 border-t border-gray-700">
          <p>
            © {new Date().getFullYear()} CountDownHub. Todos los derechos reservados.
          </p>
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;