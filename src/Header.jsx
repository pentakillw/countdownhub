import React from 'react';
// 1. Importamos 'NavLink' en lugar de 'a'
// NavLink sabe en qué página está y resalta el enlace activo
import { NavLink } from 'react-router-dom';

function Header() {
  
  // 2. Función para definir las clases de los enlaces
  // Esto nos permite cambiar el estilo si el enlace está 'activo'
  const getLinkClasses = ({ isActive }) => {
    const baseClasses = "transition-colors font-medium";
    const activeClasses = "text-brand-primary"; // Morado si está activo
    const inactiveClasses = "text-brand-light hover:text-brand-primary"; // Blanco si no
    
    return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <header className="w-full bg-brand-secondary shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo o Título (ahora usa NavLink) */}
        <div>
          <NavLink to="/" className="text-2xl font-bold text-brand-primary hover:text-purple-300 transition-colors">
            CountDownHub
          </NavLink>
        </div>

        {/* 3. Enlaces de Navegación (ahora usan NavLink) */}
        <div className="hidden md:flex space-x-6">
          <NavLink to="/movies" className={getLinkClasses}>
            Películas
          </NavLink>
          <NavLink to="/series" className={getLinkClasses}>
            Series
          </NavLink>
          <NavLink to="/sports" className={getLinkClasses}>
            Deportes
          </NavLink>
          <NavLink to="/games" className={getLinkClasses}>
            Videojuegos
          </NavLink>
        </div>

        {/* Botón de Menú Móvil (Por ahora solo es visual) */}
        <div className="md:hidden">
          <button className="text-brand-light focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

      </nav>
    </header>
  );
}

export default Header;