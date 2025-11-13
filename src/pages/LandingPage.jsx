import React from 'react';
import { Link } from 'react-router-dom';
// Importamos los iconos que usaremos
import { Check, Star, Bell, ListTodo, Newspaper, ArrowRight } from 'lucide-react';
import Footer from '../Footer.jsx'; // Importamos el footer principal

// Este es un mini-header solo para la Landing Page
function LandingHeader() {
  // ... (El código del header no cambia) ...
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center hover:opacity-80 transition-opacity">
          <span className="text-brand-t450">Clic</span>
          <span className="text-gray-t0 ml-0.5">Times</span>
        </Link>
        <div className="space-x-4">
          <Link 
            to="/app/login" 
            className="font-medium text-subtle transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-muted"
          >
            Iniciar Sesión
          </Link>
          <Link 
            to="/app/register" 
            className="font-medium bg-action-primary text-white transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-action-primary-hover"
          >
            Crear Cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />

      {/* --- Sección de Héroe (Sin cambios) --- */}
      <main className="flex-grow">
        <section className="container mx-auto px-6 py-24 md:py-32 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-default leading-tight mb-6">
            No te pierdas ni un solo
            <span className="block text-brand-t450">Estreno.</span>
          </h1>
          <p className="max-w-2xl text-xl text-subtle mb-10">
            Sigue las películas y series que más esperas. ClicTimes es tu centro de control personal para todas las fechas de lanzamiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/app" 
              className="font-medium bg-action-primary text-white transition-colors duration-200 py-3 px-8 rounded-lg text-lg hover:bg-action-primary-hover shadow-lg"
            >
              Ver Próximos Estrenos
            </Link>
            <Link 
              to="/app/register" 
              className="font-medium bg-muted text-default transition-colors duration-200 py-3 px-8 rounded-lg text-lg hover:bg-subtle shadow-lg"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>

        {/* --- Sección de Características (Sin cambios) --- */}
        <section className="bg-bg-muted py-20 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-default text-center mb-16">
              Tu cuenta regresiva personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center bg-brand-subtle text-action-primary rounded-full p-4 mb-6">
                  <Star size={32} />
                </div>
                <h3 className="text-2xl font-bold text-default mb-3">Crea tu Lista</h3>
                <p className="text-subtle">
                  Guarda las películas y series que te interesan en "Mi Lista" para tenerlas siempre a la mano.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center bg-success-subtle text-success rounded-full p-4 mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-default mb-3">Sigue el Conteo</h3>
                <p className="text-subtle">
                  Visualiza exactamente cuántos días, horas y minutos faltan para el gran estreno.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center bg-info-subtle text-info rounded-full p-4 mb-6">
                  <Bell size={32} />
                </div>
                <h3 className="text-2xl font-bold text-default mb-3">Recibe Notificaciones</h3>
                <p className="text-subtle">
                  (Próximamente) Activa las notificaciones y te avisaremos cuando tus estrenos favoritos estén por llegar.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* --- ¡NUEVA SECCIÓN: CÓMO FUNCIONA! --- */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Columna de Imagen */}
              <div>
                <img 
                  src="https://placehold.co/600x400/3D414A/F2F3F4?text=Tu+Lista+Personal" 
                  alt="Vista previa de Mi Lista en ClicTimes"
                  className="rounded-lg shadow-xl"
                />
              </div>
              {/* Columna de Texto */}
              <div className="text-left">
                <div className="inline-flex items-center justify-center bg-brand-subtle text-action-primary rounded-full p-3 mb-4">
                  <ListTodo size={28} />
                </div>
                <h2 className="text-4xl font-bold text-default mb-6">
                  Organiza todo tu contenido
                </h2>
                <p className="text-lg text-subtle mb-6">
                  ClicTimes te permite llevar un control total. Cubrimos miles de películas
                  y series en un solo lugar.
                </p>
                <ul className="space-y-4 text-subtle">
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

        {/* --- ¡NUEVA SECCIÓN: BLOG! --- */}
        <section className="py-20 md:py-24 bg-bg-muted">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Columna de Texto (orden 2 en móvil) */}
              <div className="text-left md:order-2">
                <div className="inline-flex items-center justify-center bg-info-subtle text-info rounded-full p-3 mb-4">
                  <Newspaper size={28} />
                </div>
                <h2 className="text-4xl font-bold text-default mb-6">
                  Lee análisis y noticias en el Blog
                </h2>
                <p className="text-lg text-subtle mb-6">
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
              
              {/* Columna de Imagen (orden 1 en móvil) */}
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

        {/* --- ¡NUEVA SECCIÓN: LLAMADA A LA ACCIÓN FINAL! --- */}
        <section className="py-24 bg-action-primary text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold mb-4">
              ¿Qué estás esperando?
            </h2>
            <p className="text-xl text-gray-t800 mb-8 max-w-xl mx-auto">
              Crea tu cuenta gratuita hoy mismo y ten el control total
              de los estrenos que te importan.
            </p>
            <Link 
              to="/app/register" 
              className="font-medium bg-white text-action-primary transition-colors duration-200 py-3 px-8 rounded-lg text-lg hover:bg-gray-t900 shadow-lg"
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