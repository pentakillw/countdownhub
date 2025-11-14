import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Star, LogIn, LogOut, Settings, Eye, Heart, BookOpen, Sun, Moon } from 'lucide-react';
import { useAuth } from './hooks/useAuth.js';
// --- ¡CORRECCIÓN! Esta es la ruta correcta ---
import { useTheme } from './contexts/ThemeContext.jsx';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const logoDestination = user ? '/app' : '/';

  const [isClientDark, setIsClientDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsClientDark(isDark);
    };
    
    checkTheme(); 

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    
    return () => mediaQuery.removeEventListener('change', checkTheme);
  }, [theme]); 

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else { // 'system'
      setTheme('light');
    }
  };

  const ThemeIcon = isClientDark ? Sun : Moon;
  let themeLabel;
  if (theme === 'light') themeLabel = 'Cambiar a modo oscuro';
  else if (theme === 'dark') themeLabel = 'Cambiar a tema del sistema';
  else themeLabel = 'Cambiar a modo claro';


  const linkClasses = "font-medium transition-colors duration-200 py-2 px-3 rounded-lg";
  const defaultLinkClasses = "text-text-muted hover:bg-bg-muted hover:text-text-default";
  const activeLinkClasses = "text-brand-t500 bg-gray-t50 dark:bg-transparent md:bg-transparent"; 
  const iconLinkClasses = "flex items-center font-medium transition-colors duration-200 py-2 px-3 rounded-lg";

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/'); 
  };

  return (
    <header className="w-full bg-white dark:bg-gray-t50 text-default shadow-md sticky top-0 z-50 border-b border-border-default">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      
      <div>
        <NavLink to={logoDestination} className="text-2xl font-bold flex items-center hover:opacity-80 transition-opacity">
          <span className="text-brand-t450">Clic</span>
          <span className="text-gray-t0 dark:text-gray-t950 ml-0.5">Times</span>
          </NavLink>
        </div>

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
            <NavLink
              to="/app/login"
              className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
            >
              <LogIn size={18} className="mr-1" />
              Iniciar Sesión
            </NavLink>
          )}

          <button
            onClick={cycleTheme}
            className={`${iconLinkClasses} ${defaultLinkClasses} !p-2 ml-2`}
            aria-label={themeLabel}
          >
            <ThemeIcon size={18} />
          </button>

          <a
            href="https://buymeacoffee.com/duart3mirar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center ml-2 px-3 py-2 rounded-lg bg-action-primary text-text-on-accent text-sm font-medium hover:bg-action-primary-hover transition-colors"
          >
            <Heart size={16} className="mr-1.5" />
            Apoya el proyecto
          </a>
        </div>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-text-muted p-2 rounded-lg hover:bg-bg-muted focus:outline-none focus:ring-2 focus:ring-brand-t500"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <div 
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-t50 shadow-lg absolute top-full left-0 w-full z-40 border-t border-border-default`}
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

          <NavLink 
            to="/app/blog" 
            className={({ isActive }) => `${iconLinkClasses} ${defaultLinkClasses} ${isActive ? 'text-brand-t500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <BookOpen size={18} className="mr-1" />
            Blog
          </NavLink>
          
          <hr className="border-border-default my-2" />

          <a
            href="https://buymeacoffee.com/duart3mirar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-3 py-2 rounded-lg bg-action-primary text-text-on-accent text-sm font-medium hover:bg-action-primary-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Heart size={16} className="mr-1.5" />
            Apoya el proyecto
          </a>

          <button
            onClick={() => {
              cycleTheme();
              setIsMobileMenuOpen(false);
            }}
            className={`${iconLinkClasses} ${defaultLinkClasses} text-left w-full`}
            aria-label={themeLabel}
          >
            <ThemeIcon size={18} className="mr-1" />
            {themeLabel}
          </button>
          
          <hr className="border-border-default my-2" />

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