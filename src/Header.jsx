import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Star, LogIn, LogOut, Settings, Eye, Heart, BookOpen } from 'lucide-react';
// --- ¡ERROR CORREGIDO! ---
// Se añadió la extensión .js para que el sistema de imports de Vite
// pueda encontrar el archivo correctamente.
import { useAuth } from './hooks/useAuth.js';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // --- ¡NUEVA LÓGICA DE ENLACE! ---
  const logoDestination = user ? '/app' : '/';

  const linkClasses = "font-medium transition-colors duration-200 py-2 px-3 rounded-lg";
  const defaultLinkClasses = "text-gray-t500 hover:bg-gray-t100 hover:text-gray-t950";
  const activeLinkClasses = "text-brand-t500 bg-gray-t50 md:bg-transparent"; 
  const iconLinkClasses = "flex items-center font-medium transition-colors duration-200 py-2 px-3 rounded-lg";

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/'); 
  };

  return (
    <header className="w-full bg-white text-default shadow-md sticky top-0 z-50 border-b border-gray-t900">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      
      <div>
        {/* --- ¡ENLACE ACTUALIZADO! --- */}
        <NavLink to={logoDestination} className="text-2xl font-bold flex items-center hover:opacity-80 transition-opacity">
          <span className="text-brand-t450">Clic</span>
          <span className="text-gray-t0 ml-0.5">Times</span>
          </NavLink>
        </div>

        {/* --- NAVEGACIÓN DE ESCRITORIO --- */}
        <div className="hidden md:flex space-x-2 items-center">
          <NavLink 
            to="/app/movies" 
            className={({ isActive }) => `${linkClasses} ${defaultLinkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            Películas
          </NavLink>
          <NavLink 
            to="/app/series" 
            className={({ isActive }) => `${linkClasses} ${defaultLinkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            Series
          </NavLink>
          
          {/* --- ¡NUEVO ENLACE AL BLOG! --- */}
          <NavLink 
            to="/app/blog" 
            className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
          >
            <BookOpen size={18} className="mr-1" />
            Blog
          </NavLink>
          
          {user ? (
            <>
              <NavLink
                to="/app/my-list"
                className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
              >
                <Star size={18} className="mr-1" />
                Mi Lista
              </NavLink>
              {/* ... (resto de enlaces de usuario) ... */}
              <NavLink
                to="/app/history"
                className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
              >
                <Eye size={18} className="mr-1" />
                Mi Historial
              </NavLink>
              
              <NavLink
                to="/app/settings"
                className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
              >
                <Settings size={18} className="mr-1" />
                Configuración
              </NavLink>
              
              <button
                onClick={handleLogout}
                className={`${iconLinkClasses} ${defaultLinkClasses} text-left`}
                aria-label="Cerrar Sesión"
              >
                <LogOut size={18} className="mr-1" />
                Cerrar Sesión
              </button>
            </>
          ) : (
             // ... (Botón Iniciar Sesión) ...
            <NavLink
              to="/app/login"
              className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
            >
              <LogIn size={18} className="mr-1" />
              Iniciar Sesión
            </NavLink>
          )}

          <a
            href="https://buymeacoffee.com/duart3mirar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center ml-4 px-3 py-2 rounded-lg bg-action-primary text-white text-sm font-medium hover:bg-action-primary-hover transition-colors"
          >
            <Heart size={16} className="mr-1.5" />
            Apoya el proyecto
          </a>
        </div>

        {/* Botón de Menú Móvil */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-t500 p-2 rounded-lg hover:bg-gray-t100 focus:outline-none focus:ring-2 focus:ring-brand-t500"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- MENÚ DESPLEGABLE MÓVIL (CORREGIDO) --- */}
      <div 
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg absolute top-full left-0 w-full z-40 border-t border-gray-t900`}
      >
        <div className="flex flex-col space-y-2 px-4 py-3">
          <NavLink 
            to="/app/movies" 
            className={({ isActive }) => `${linkClasses} ${defaultLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Películas
          </NavLink>
          <NavLink 
            to="/app/series" 
            className={({ isActive }) => `${linkClasses} ${defaultLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Series
          </NavLink>

          {/* --- ¡NUEVO ENLACE AL BLOG (MÓVIL)! --- */}
          <NavLink 
            to="/app/blog" 
            className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <BookOpen size={18} className="mr-1" />
            Blog
          </NavLink>
          
          <hr className="border-gray-t900 my-2" />

          <a
            href="https://buymeacoffee.com/duart3mirar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-3 py-2 rounded-lg bg-action-primary text-white text-sm font-medium hover:bg-action-primary-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Heart size={16} className="mr-1.5" />
            Apoya el proyecto
          </a>

          {user ? (
            <>
              <NavLink
                to="/app/my-list"
                className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star size={18} className="mr-1" />
                Mi Lista
              </NavLink>
              {/* ... (resto de enlaces de usuario móvil) ... */}
              <NavLink
                to="/app/history"
                className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Eye size={18} className="mr-1" />
                Mi Historial
              </NavLink>
              
              <NavLink
                to="/app/settings"
                className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings size={18} className="mr-1" />
                Configuración
              </NavLink>
              
              <button
                onClick={handleLogout}
                className={`${iconLinkClasses} ${defaultLinkClasses} text-left`}
                aria-label="Cerrar Sesión"
              >
                <LogOut size={18} className="mr-1" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            // ... (Botón Iniciar Sesión móvil) ...
            <NavLink
              to="/app/login"
              className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn size={18} className="mr-1" />
              Iniciar Sesión
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;