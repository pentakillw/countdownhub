import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AuthProvider from './contexts/AuthContext.jsx';
// --- ¡NUEVO! Importamos iconos y hooks ---
import { ArrowUp, ArrowDown } from 'lucide-react';

// Este componente App ahora actúa como el 'Layout' principal
function App() {
  // --- ¡NUEVO! Estado y lógica para los botones de scroll ---
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Muestra los botones si el usuario ha bajado más de 300px
      if (window.scrollY > 300) {
        setShowScrollButtons(true);
      } else {
        setShowScrollButtons(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Limpia el listener al desmontar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };
  // --- Fin de la lógica de scroll ---

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-default">
        
        <Header />

        <main className="flex-grow container mx-auto px-6 py-8">
          <Outlet />
        </main>

        <Footer />

        {/* --- ¡NUEVO! Botones Flotantes de Scroll --- */}
        {showScrollButtons && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button
              onClick={scrollToTop}
              className="p-3 bg-action-primary text-white rounded-full shadow-lg hover:bg-action-primary-hover transition-colors"
              aria-label="Subir al inicio"
            >
              <ArrowUp size={24} />
            </button>
            <button
              onClick={scrollToBottom}
              className="p-3 bg-action-primary text-white rounded-full shadow-lg hover:bg-action-primary-hover transition-colors"
              aria-label="Bajar al final"
            >
              <ArrowDown size={24} />
            </button>
          </div>
        )}
        {/* --- Fin de Botones Flotantes --- */}
        
      </div>
    </AuthProvider>
  );
}

export default App;