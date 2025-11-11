import React, { useState } from 'react'; // 1. Importamos useState
import { NavLink } from 'react-router-dom';
// 2. Importamos los íconos de Menú y X
import { Menu, X } from 'lucide-react'; 

function Header() {
  // 3. Añadimos un estado para saber si el menú móvil está abierto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Clases para los enlaces de escritorio
  const getLinkClasses = ({ isActive }) => {
    const baseClasses = "transition-colors font-medium";
    const activeClasses = "text-brand-primary"; // Morado si está activo
    const inactiveClasses = "text-brand-light hover:text-brand-primary"; // Blanco si no
    
    return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };

  // Clases para los enlaces del menú móvil (son diferentes)
  const getMobileLinkClasses = ({ isActive }) => {
    const baseClasses = "block py-3 px-4 text-lg rounded-md transition-colors font-medium";
    const activeClasses = "bg-brand-primary text-white"; // Fondo morado si está activo
    const inactiveClasses = "text-brand-light hover:bg-gray-700"; // Fondo gris al pasar el mouse
    
    return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };

  // Función para cerrar el menú al hacer clic en un enlace
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    // 4. Añadimos 'relative' para posicionar el menú desplegable
    <header className="w-full bg-brand-secondary shadow-lg relative z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo o Título */}
        <div>
          <NavLink to="/" className="text-2xl font-bold text-brand-primary hover:text-purple-300 transition-colors">
            CountDownHub
          </NavLink>
        </div>

        {/* Enlaces de Navegación (Escritorio) */}
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

        {/* 5. Botón de Menú Móvil (Ahora con lógica) */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // <-- Lógica de clic
            className="text-brand-light focus:outline-none"
            aria-label="Abrir menú"
          >
            {/* Cambia el ícono de hamburguesa a 'X' si está abierto */}
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" /> 
            )}
          </button>
        </div>

      </nav>

      {/* --- 6. El Menú Móvil Desplegable --- */}
      {/* Aparece solo en móviles (md:hidden) y si isMobileMenuOpen es true */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute w-full bg-brand-secondary shadow-lg py-4`}>
        <div className="container mx-auto px-6 flex flex-col space-y-2">
          <NavLink to="/movies" className={getMobileLinkClasses} onClick={handleMobileLinkClick}>
            Películas
          </NavLink>
          <NavLink to="/series" className={getMobileLinkClasses} onClick={handleMobileLinkClick}>
            Series
          </NavLink>
          <NavLink to="/sports" className={getMobileLinkClasses} onClick={handleMobileLinkClick}>
            Deportes
          </NavLink>
          <NavLink to="/games" className={getMobileLinkClasses} onClick={handleMobileLinkClick}>
            Videojuegos
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;