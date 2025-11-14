import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// --- ¡MODIFICACIÓN! ---
// Añadimos Sun y Moon para el botón de tema
import { Check, Star, Bell, ListTodo, Newspaper, ArrowRight, LogIn, UserPlus, Sun, Moon } from 'lucide-react';
import Footer from '../Footer.jsx'; 
// --- ¡MODIFICACIÓN! ---
// Importamos el hook useTheme
import { useTheme } from '../contexts/ThemeContext.jsx'; 

function LandingHeader() {
  // --- ¡MODIFICACIÓN! ---
  // Añadimos la lógica completa para el botón de tema
  const { theme, setTheme } = useTheme();
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
  // --- FIN DE LÓGICA DE TEMA ---

  return (
    <header className="w-full bg-white dark:bg-bg-muted shadow-sm sticky top-0 z-50 border-b border-border-default">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center hover:opacity-80 transition-opacity">
          <span className="text-brand-t450">Clic</span>
          <span className="text-gray-t0 dark:text-gray-t950 ml-0.5">Times</span>
        </Link>
        {/* --- ¡MODIFICACIÓN! Añadido 'items-center' --- */}
        <div className="flex flex-wrap justify-end gap-3 items-center">
          <Link 
            to="/app/login" 
            className="font-medium text-text-subtle transition-colors duration-200 py-2 rounded-lg hover:bg-bg-muted md:px-3 px-2"
            aria-label="Iniciar Sesión"
          >
            <LogIn size={20} className="block md:hidden" />
            <span className="hidden md:block">Iniciar Sesión</span>
          </Link>
          
          <Link 
            to="/app/register" 
            className="font-medium bg-action-primary text-text-on-accent transition-colors duration-200 py-2 rounded-lg hover:bg-action-primary-hover md:px-4 px-2"
            aria-label="Crear Cuenta"
          >
            <UserPlus size={20} className="block md:hidden" />
            <span className="hidden md:block">Crear Cuenta</span>
          </Link>

          {/* --- ¡BOTÓN DE TEMA MOVIDO AL FINAL! --- */}
          <button
            onClick={cycleTheme}
            className="font-medium text-text-subtle transition-colors duration-200 p-2 rounded-lg hover:bg-bg-muted"
            aria-label={themeLabel}
          >
            <ThemeIcon size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-bg-default">
      <LandingHeader />

      <main className="flex-grow">
        <section className="container mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-text-default leading-tight mb-6">
            No te pierdas ni un solo
            <span className="block text-brand-t450">Estreno.</span>
          </h1>
          <p className="max-w-2xl text-xl text-text-subtle mb-10">
            Sigue las películas y series que más esperas. ClicTimes es tu centro de control personal para todas las fechas de lanzamiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/app" 
              className="font-medium bg-action-primary text-text-on-accent transition-colors duration-200 py-3 px-8 rounded-lg text-lg hover:bg-action-primary-hover shadow-lg"
            >
              Ver Próximos Estrenos
            </Link>
            <Link 
              to="/app/register" 
              className="font-medium bg-bg-muted text-text-default transition-colors duration-200 py-3 px-8 rounded-lg text-lg hover:bg-bg-subtle shadow-lg"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>

        <section className="bg-bg-muted py-20 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-text-default text-center mb-16">
              Tu cuenta regresiva personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              
              <div className="bg-white dark:bg-bg-subtle p-8 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center bg-brand-subtle text-action-primary rounded-full p-4 mb-6">
                  <Star size={32} />
                </div>
                <h3 className="text-2xl font-bold text-text-default mb-3">Crea tu Lista</h3>
                <p className="text-text-subtle">
                  Guarda las películas y series que te interesan en "Mi Lista" para tenerlas siempre a la mano.
                </p>
              </div>

              <div className="bg-white dark:bg-bg-subtle p-8 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center bg-success-subtle text-success rounded-full p-4 mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-text-default mb-3">Sigue el Conteo</h3>
                <p className="text-text-subtle">
                  Visualiza exactamente cuántos días, horas y minutos faltan para el gran estreno.
                </p>
              </div>

              <div className="bg-white dark:bg-bg-subtle p-8 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center bg-info-subtle text-info rounded-full p-4 mb-6">
                  <Bell size={32} />
                </div>
                <h3 className="text-2xl font-bold text-text-default mb-3">Recibe Notificaciones</h3>
                <p className="text-text-subtle">
                  (Próximamente) Activa las notificaciones y te avisaremos cuando tus estrenos favoritos estén por llegar.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://placehold.co/600x400/3D414A/F2F3F4?text=Tu+Lista+Personal" 
                  alt="Vista previa de Mi Lista en ClicTimes"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="text-left">
                <div className="inline-flex items-center justify-center bg-brand-subtle text-action-primary rounded-full p-3 mb-4">
                  <ListTodo size={28} />
                </div>
                <h2 className="text-4xl font-bold text-text-default mb-6">
                  Organiza todo tu contenido
                </h2>
                <p className="text-lg text-text-subtle mb-6">
                  ClicTimes te permite llevar un control total. Cubrimos miles de películas
                  y series en un solo lugar.
                </p>
                <ul className="space-y-4 text-text-subtle">
                  <li className="flex items-start">
                    <Star size={20} className="mr-3 text-brand-t450 flex-shrink-0 mt-1" />
                    <span>
                      Usa <strong>Mi Lista (⭐)</strong> para guardar los estrenos que
                      más esperas y no perderles la pista.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="mr-3 text-success flex-shrink-0 mt-1" />
                    <span>
                      Marca lo que ya viste con <strong>Mi Historial (👁️)</strong> para
                      mantener un registro de tu contenido.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-bg-muted">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left md:order-2">
                <div className="inline-flex items-center justify-center bg-info-subtle text-info rounded-full p-3 mb-4">
                  <Newspaper size={28} />
                </div>
                <h2 className="text-4xl font-bold text-text-default mb-6">
                  Lee análisis y noticias en el Blog
                </h2>
                <p className="text-lg text-text-subtle mb-6">
                  Para cumplir con AdSense y ofrecerte valor, nuestro blog está
                  lleno de artículos originales, análisis y noticias sobre
                  el mundo del cine y las series. ¡Descubre contenido nuevo
                  cada semana!
                </p>
                <Link 
                  to="/app/blog" 
                  className="inline-flex items-center font-medium text-brand-t450 hover:text-brand-t400 transition-colors"
                >
                  Ir al Blog
                  <ArrowRight size={20} className="ml-1.5" />
                </Link>
              </div>
              
              <div className="md:order-1">
                <img 
                  src="https://placehold.co/600x400/000165/F2F3F4?text=Blog+ClicTimes" 
                  alt="Vista previa del Blog de ClicTimes"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-action-primary text-text-on-accent">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold mb-4">
              ¿Qué estás esperando?
            </h2>
            <p className="text-xl text-gray-t800 dark:text-gray-t800 mb-8 max-w-xl mx-auto">
              Crea tu cuenta gratuita hoy mismo y ten el control total
              de los estrenos que te importan.
            </p>
            <Link 
              to="/app/register" 
              className="font-medium bg-white dark:bg-gray-t950 text-action-primary dark:text-brand-t650 transition-colors duration-200 py-3 px-8 rounded-lg text-lg hover:bg-gray-t900 shadow-lg"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

export default LandingPage;