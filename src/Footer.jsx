import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useAuth } from './hooks/useAuth'; 

function Footer() {
  
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const logoDestination = user ? '/app' : '/'; 
  
  // --- ¡MODIFICACIÓN! Usa 'text-text-subtle' y 'text-text-default' ---
  const linkStyle = "text-text-subtle hover:text-text-default transition-colors duration-200";

  return (
    // --- ¡MODIFICACIÓN! Fondo, texto y borde semánticos ---
    <footer className="w-full bg-bg-muted text-text-default py-12 border-t border-border-default">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between gap-10">

          <div className="w-full md:w-1/3 lg:w-1/4">
            <NavLink to={logoDestination} className="text-2xl font-bold flex items-center mb-2 hover:opacity-80 transition-opacity">
              <span className="text-brand-t450">Clic</span>
              {/* --- ¡MODIFICACIÓN! Usa 'text-text-default' --- */}
              <span className="text-text-default">Times</span>
            </NavLink>
            {/* --- ¡MODIFICACIÓN! Usa 'text-text-subtle' --- */}
            <p className="text-sm text-text-subtle mb-6">
              Tu centro de control para próximos estrenos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={linkStyle} aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className={linkStyle} aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className={linkStyle} aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className={linkStyle} aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div>
              {/* --- ¡MODIFICACIÓN! Usa 'text-text-default' --- */}
              <h3 className="text-sm font-semibold text-text-default uppercase tracking-wider mb-4">Navegación</h3>
              <ul className="space-y-3">
                <li><NavLink to="/app" className={linkStyle}>Inicio</NavLink></li>
                <li><NavLink to="/app/movies" className={linkStyle}>Películas</NavLink></li>
                <li><NavLink to="/app/series" className={linkStyle}>Series</NavLink></li>
                <li><NavLink to="/app/blog" className={linkStyle}>Blog</NavLink></li>
                <li><NavLink to="/app/my-list" className={linkStyle}>Mi Lista</NavLink></li>
              </ul>
            </div>

            <div>
              {/* --- ¡MODIFICACIÓN! Usa 'text-text-default' --- */}
              <h3 className="text-sm font-semibold text-text-default uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><NavLink to="/app/terms" className={linkStyle}>Términos y Condiciones</NavLink></li>
                <li><NavLink to="/app/privacy" className={linkStyle}>Política de Privacidad</NavLink></li>
              </ul>
            </div>

            <div>
              {/* --- ¡MODIFICACIÓN! Usa 'text-text-default' --- */}
              <h3 className="text-sm font-semibold text-text-default uppercase tracking-wider mb-4">Proyecto</h3>
              <ul className="space-y-3">
                <li><a href="#" className={linkStyle}>Acerca de ClicTimes</a></li>
                <li>
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

        {/* --- ¡MODIFICACIÓN! Borde semántico --- */}
        <div className="mt-12 pt-8 border-t border-border-default flex flex-col md:flex-row items-center justify-between">
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-sm text-text-subtle text-center md:text-left">
            © {new Date().getFullYear()} ClicTimes. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center mt-4 md:mt-0">
            {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
            <p className="text-sm text-text-subtle mr-4">
              Datos provistos por
            </p>
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              // --- ¡MODIFICACIÓN! Fondo semántico para el logo de TMDB en modo oscuro ---
              className="inline-block p-1.5 rounded bg-white dark:bg-gray-t850" // Fondo blanco solo para el logo
              aria-label="Logo de The Movie Database (TMDB)"
              aria-describedby="tmdb-attribution"
            >
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="Logo de The Movie Database (TMDB)"
                className="h-6 w-auto" 
                referrerPolicy="no-referrer"
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