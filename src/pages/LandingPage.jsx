import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Bell } from 'lucide-react';
// --- ¡NUEVA IMPORTACIÓN! ---
// --- ¡RUTA CORREGIDA! ---
// Asumiendo que Footer.jsx está en src/ y no en src/pages/
import Footer from '../Footer.jsx'; // Importamos el footer principal

// Este es un mini-header solo para la Landing Page
function LandingHeader() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* --- ¡CONVERTIDO A ENLACE! --- */}
        {/* Ahora el logo en la Landing Page apunta a la raíz ("/") */}
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

// --- ¡SE ELIMINÓ EL COMPONENTE 'LandingFooter' ---
// Ya no es necesario, usaremos el 'Footer' principal importado.

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />

      {/* --- Sección de Héroe --- */}
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

        {/* --- Sección de Características --- */}
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
      </main>
      
      {/* --- ¡FOOTER ACTUALIZADO! --- */}
      {/* Ahora usa el 'Footer' principal en lugar de 'LandingFooter' */}
      <Footer />
    </div>
  );
}

export default LandingPage;