import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Star, LogIn, LogOut, Settings, Eye, Heart, BookOpen, Sun, Moon, Film, Tv } from 'lucide-react';
import { useAuth } from './hooks/useAuth.js';
import { useTheme } from './contexts/ThemeContext.jsx';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // Estado para detectar scroll
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

  // --- EFECTO DE SCROLL ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = isClientDark ? Sun : Moon;
  
  // Clases dinámicas
  const linkClasses = "font-medium transition-all duration-200 py-2 px-3 rounded-lg flex items-center";
  const defaultLinkClasses = "text-text-muted hover:bg-bg-muted/50 hover:text-text-default hover:scale-105";
  const activeLinkClasses = "text-brand-t500 bg-brand-t50 dark:bg-white/10 shadow-sm"; 
  
  // --- CLASE DEL HEADER (GLASSMORPHISM) ---
  const headerClasses = `w-full sticky top-0 z-50 transition-all duration-300 border-b ${
    scrolled 
      ? 'bg-white/80 dark:bg-gray-t50/80 backdrop-blur-md shadow-md border-border-default/50' 
      : 'bg-white dark:bg-gray-t50 border-transparent shadow-none'
  }`;

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/'); 
  };

  return (
    <header className={headerClasses}>
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        <div>
          <NavLink to={logoDestination} className="text-2xl font-black flex items-center hover:opacity-80 transition-opacity tracking-tight">
            <span className="text-brand-t450">Clic</span>
            <span className="text-gray-t0 dark:text-gray-t950">Times</span>
          </NavLink>
        </div>

        <div className="hidden md:flex space-x-1 items-center">
          <NavLink to="/app/movies" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
            <Film size={18} className="mr-1.5" /> Películas
          </NavLink>
          <NavLink to="/app/series" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
            <Tv size={18} className="mr-1.5" /> Series
          </NavLink>
          <NavLink to="/app/blog" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
            <BookOpen size={18} className="mr-1.5" /> Blog
          </NavLink>
          
          <div className="h-6 w-px bg-border-default mx-2"></div>

          {user ? (
            <>
              <NavLink to="/app/my-list" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`} title="Mi Lista">
                <Star size={18} />
              </NavLink>
              <NavLink to="/app/history" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`} title="Historial">
                <Eye size={18} />
              </NavLink>
              <NavLink to="/app/settings" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`} title="Configuración">
                <Settings size={18} />
              </NavLink>
              <button onClick={handleLogout} className={`${linkClasses} ${defaultLinkClasses}`} title="Cerrar Sesión">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <NavLink to="/app/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
              <LogIn size={18} className="mr-1.5" /> Entrar
            </NavLink>
          )}

          <button onClick={cycleTheme} className={`${linkClasses} ${defaultLinkClasses} !px-2`} title="Cambiar Tema">
            <ThemeIcon size={18} />
          </button>

          <a
            href="https://buymeacoffee.com/duart3mirar"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 rounded-full bg-action-primary text-text-on-accent text-sm font-bold hover:bg-action-primary-hover transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center"
          >
            <Heart size={14} className="mr-1.5 fill-current" /> Apoyar
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
            <button onClick={cycleTheme} className="p-2 text-text-subtle">
                <ThemeIcon size={20} />
            </button>
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-text-default p-2 rounded-lg hover:bg-bg-muted focus:outline-none"
            >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-t50 shadow-xl border-t border-border-default transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
        <div className="flex flex-col p-4 space-y-2">
          <NavLink to="/app/movies" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
            <Film size={18} className="mr-2" /> Películas
          </NavLink>
          <NavLink to="/app/series" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
            <Tv size={18} className="mr-2" /> Series
          </NavLink>
          <NavLink to="/app/blog" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
            <BookOpen size={18} className="mr-2" /> Blog
          </NavLink>
          
          <hr className="border-border-default my-1" />

          {user ? (
            <>
              <NavLink to="/app/my-list" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
                <Star size={18} className="mr-2" /> Mi Lista
              </NavLink>
              <NavLink to="/app/history" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
                <Eye size={18} className="mr-2" /> Historial
              </NavLink>
              <NavLink to="/app/settings" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
                <Settings size={18} className="mr-2" /> Configuración
              </NavLink>
              <button onClick={handleLogout} className={`${linkClasses} ${defaultLinkClasses} w-full text-left text-text-critical`}>
                <LogOut size={18} className="mr-2" /> Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink to="/app/login" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : defaultLinkClasses}`}>
              <LogIn size={18} className="mr-2" /> Iniciar Sesión
            </NavLink>
          )}
          
          <div className="pt-2">
             <a href="https://buymeacoffee.com/duart3mirar" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-action-primary text-text-on-accent font-bold">
                <Heart size={16} className="mr-2 fill-current" /> Apoyar Proyecto
             </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;