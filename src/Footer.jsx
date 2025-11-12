import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

function Footer() {
  
  // Estilo reutilizable para los enlaces del footer
  const linkStyle = "text-gray-t500 hover:text-gray-t950 transition-colors duration-200";

  return (
    // Usamos 'bg-inverse' (oscuro) y texto 'gray-t400' (claro)
    <footer className="w-full bg-inverse text-gray-t400 py-12">
      <div className="container mx-auto px-6">
        
        {/* --- Sección Superior: Logo y Enlaces --- */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* 1. Logo, Eslogan y Redes */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <NavLink to="/app" className="text-2xl font-bold flex items-center mb-2 hover:opacity-80 transition-opacity">
              {/* Logo en colores invertidos para fondo oscuro */}
              <span className="text-brand-t500">Clic</span>
              <span className="text-gray-t950">Times</span>
            </NavLink>
            <p className="text-sm text-gray-t500 mb-6">
              Tu centro de control para próximos estrenos.
            </p>
            {/* Redes Sociales */}
            <div className="flex space-x-4">
              <a href="#" className={linkStyle} aria-label="Facebook"><Facebook size={20} /></a>
              {/* --- ¡ERROR CORREGIDO AQUÍ! --- */}
              <a href="#" className={linkStyle} aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className={linkStyle} aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className={linkStyle} aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* 2. Columnas de Enlaces */}
          <div className="w-full md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Columna: Navegación */}
            <div>
              <h3 className="text-sm font-semibold text-gray-t950 uppercase tracking-wider mb-4">Navegación</h3>
              <ul className="space-y-3">
                <li><NavLink to="/app" className={linkStyle}>Inicio</NavLink></li>
                {/* --- ¡ERROR CORREGIDO AQUÍ! --- */}
                <li><NavLink to="/app/movies" className={linkStyle}>Películas</NavLink></li>
                <li><NavLink to="/app/series" className={linkStyle}>Series</NavLink></li>
                <li><NavLink to="/app/my-list" className={linkStyle}>Mi Lista</NavLink></li>
              </ul>
            </div>

            {/* Columna: Legal (Tus nuevos enlaces) */}
            <div>
              <h3 className="text-sm font-semibold text-gray-t950 uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                {/* Usamos 'a' href="#" como placeholder. Cambia a NavLink si son rutas internas */}
                <li><a href="#" className={linkStyle}>Términos y Condiciones</a></li>
               
                <li><a href="#" className={linkStyle}>Política de Privacidad</a></li>
              </ul>
            </div>

            {/* Columna: Proyecto */}
            <div>
              <h3 className="text-sm font-semibold text-gray-t950 uppercase tracking-wider mb-4">Proyecto</h3>
              <ul className="space-y-3">
                <li><a href="#" className={linkStyle}>Acerca de ClicTimes</a></li>
                <li>
                  {/* --- ¡ERROR CORREGIDO AQUÍ! --- (Faltaba el 's' en https) */}
                  <a 
                    href="https://buymeacoffee.com/duart3mirar"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-brand-t500 hover:text-brand-t600 transition-colors duration-200"
                  >
                    <Heart size={18} className="mr-1.5" />
                    Apoya el proyecto
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* --- Sección Inferior: Copyright y TMDB --- */}
        <div className="mt-12 pt-8 border-t border-gray-t150 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-t500 text-center md:text-left">
            © {new Date().getFullYear()} ClicTimes. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center mt-4 md:mt-0">
            <p className="text-sm text-gray-t500 mr-4">
              Datos provistos por
            </p>
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white p-1.5 rounded-md shadow-sm" // Fondo blanco para el logo
              aria-label="Logo de The Movie Database (TMDB)"
              aria-describedby="tmdb-attribution"
            >
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="Logo de The Movie Database (TMDB)"
                className="h-6 w-auto" // h-6 (24px) es un tamaño sutil
                referrerpolicy="no-referrer"
              />
            </a>
            <span id="tmdb-attribution" className="sr-only">Logo de The Movie Database (TMDB)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;