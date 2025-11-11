import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Star, LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from './hooks/useAuth.js';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const linkClasses = "font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted";
  const activeLinkClasses = "pb-1 border-b-2 border-action-primary bg-muted md:bg-transparent"; 
  const iconLinkClasses = "flex items-center font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted";

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/'); // Al cerrar sesión, lo mandamos a la Landing Page
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        <div>
          {/* El logo ahora apunta a /app (la app) y no a / (la landing) */}
          <NavLink to="/app" className="text-2xl font-bold flex items-center hover:opacity-80 transition-opacity">
            <span className="text-brand-t450">Clic</span>
            <span className="text-gray-t0 ml-0.5">Times</span>
          </NavLink>
        </div>

        {/* --- NAVEGACIÓN DE ESCRITORIO (RUTAS ACTUALIZADAS) --- */}
        <div className="hidden md:flex space-x-2 items-center">
          <NavLink 
            to="/app/movies" // <-- Ruta actualizada
            className={({ isActive }) => `${linkClasses} text-default ${isActive ? activeLinkClasses : ''}`}
          >
            Películas
          </NavLink>
          <NavLink 
            to="/app/series" // <-- Ruta actualizada
            className={({ isActive }) => `${linkClasses} text-default ${isActive ? activeLinkClasses : ''}`}
          >
            Series
          </NavLink>
          
          {user ? (
            <>
              <NavLink
                to="/app/my-list" // <-- Ruta actualizada
                className={({ isActive }) => `${iconLinkClasses} text-default ${isActive ? 'text-action-primary' : ''}`}
              >
                <Star size={18} className="mr-1" />
                Mi Lista
              </NavLink>
              
              {/* --- ¡NUEVO ENLACE! --- */}
              <NavLink
                to="/app/settings" // <-- Ruta nueva
                className={({ isActive }) => `${iconLinkClasses} text-default ${isActive ? 'text-action-primary' : ''}`}
              >
                <Settings size={18} className="mr-1" />
                Configuración
              </NavLink>
              
              <button
                onClick={handleLogout}
                className={`${iconLinkClasses} text-subtle hover:text-action-primary`}
                aria-label="Cerrar Sesión"
              >
                <LogOut size={18} className="mr-1" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/app/login" // <-- Ruta actualizada
              className={({ isActive }) => `${iconLinkClasses} text-default ${isActive ? 'text-action-primary' : ''}`}
            >
              <LogIn size={18} className="mr-1" />
              Iniciar Sesión
            </NavLink>
          )}
        </div>

        {/* Botón de Menú Móvil */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-default p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-action-primary"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- MENÚ DESPLEGABLE MÓVIL (RUTAS ACTUALIZADAS) --- */}
      <div 
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg absolute top-full left-0 w-full z-40`}
      >
        <div className="flex flex-col space-y-2 px-4 py-3">
          <NavLink 
            to="/app/movies" // <-- Ruta actualizada
            className={({ isActive }) => `${linkClasses} text-default ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Películas
          </NavLink>
          <NavLink 
            to="/app/series" // <-- Ruta actualizada
            className={({ isActive }) => `${linkClasses} text-default ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Series
          </NavLink>
          
          <hr className="border-default my-2" />

          {user ? (
            <>
              <NavLink
                to="/app/my-list" // <-- Ruta actualizada
                className={({ isActive }) => `${iconLinkClasses} text-default ${isActive ? 'text-action-primary' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star size={18} className="mr-1" />
                Mi Lista
              </NavLink>
              
              {/* --- ¡NUEVO ENLACE! --- */}
              <NavLink
                to="/app/settings" // <-- Ruta nueva
                className={({ isActive }) => `${iconLinkClasses} text-default ${isActive ? 'text-action-primary' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings size={18} className="mr-1" />
                Configuración
              </NavLink>
              
              <button
                onClick={handleLogout}
                className={`${iconLinkClasses} text-subtle hover:text-action-primary text-left`}
                aria-label="Cerrar Sesión"
              >
                <LogOut size={18} className="mr-1" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/app/login" // <-- Ruta actualizada
              className={({ isActive }) => `${iconLinkClasses} text-default ${isActive ? 'text-action-primary' : ''}`}
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