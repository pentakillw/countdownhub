import React, { useState } from 'react';
// Importamos NavLink para la navegación y los íconos
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  // Estado para manejar si el menú móvil está abierto o cerrado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Clases base para los enlaces (para no repetirlas)
  const linkClasses = "font-medium transition-colors duration-200";
  // Clases para el NavLink activo (subrayado)
  const activeLinkClasses = "pb-1 border-b-2 border-brand-blue";

  return (
    // Header con fondo blanco y sombra
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo o Título del Sitio (ClicTimes) */}
        <div>
          <NavLink to="/" className="text-2xl font-bold text-brand-blue hover:opacity-80 transition-opacity">
            ClicTimes
          </NavLink>
        </div>

        {/* Enlaces de Navegación (Escritorio) */}
        <div className="hidden md:flex space-x-8">
          <NavLink 
            to="/movies" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
          >
            Películas
          </NavLink>
          <NavLink 
            to="/series" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
          >
            Series
          </NavLink>
          <NavLink 
            to="/sports" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
          >
            Deportes
          </NavLink>
          <NavLink 
            to="/games" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
          >
            Videojuegos
          </NavLink>
        </div>

        {/* Botón de Menú Móvil (visible en pantallas pequeñas) */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-brand-text focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- Menú Desplegable Móvil --- */}
      {/* Aparece si 'isMobileMenuOpen' es true */}
      <div 
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg absolute top-full left-0 w-full z-40`}
      >
        <div className="flex flex-col space-y-4 px-6 py-5">
          <NavLink 
            to="/movies" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al hacer clic
          >
            Películas
          </NavLink>
          <NavLink 
            to="/series" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Series
          </NavLink>
          <NavLink 
            to="/sports" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Deportes
          </NavLink>
          <NavLink 
            to="/games" 
            className={({ isActive }) => `${linkClasses} text-brand-text hover:text-brand-blue ${isActive ? activeLinkClasses : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Videojuegos
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;