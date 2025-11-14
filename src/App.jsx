import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AuthProvider from './contexts/AuthContext.jsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

function App() {
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButtons(true);
      } else {
        setShowScrollButtons(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      {/* --- ¡MODIFICACIÓN! --- */}
      {/* Se elimina 'bg-default' ya que ahora está en el <body> */}
      <div className="min-h-screen flex flex-col">
        
        <Header />

        <main className="flex-grow container mx-auto px-6 py-8">
          <Outlet />
        </main>

        <Footer />

        {showScrollButtons && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button
              onClick={scrollToTop}
              // --- ¡MODIFICACIÓN! 'text-white' -> 'text-text-on-accent' ---
              className="p-3 bg-action-primary text-text-on-accent rounded-full shadow-lg hover:bg-action-primary-hover transition-colors"
              aria-label="Subir al inicio"
            >
              <ArrowUp size={24} />
            </button>
            <button
              onClick={scrollToBottom}
              // --- ¡MODIFICACIÓN! 'text-white' -> 'text-text-on-accent' ---
              className="p-3 bg-action-primary text-text-on-accent rounded-full shadow-lg hover:bg-action-primary-hover transition-colors"
              aria-label="Bajar al final"
            >
              <ArrowDown size={24} />
            </button>
          </div>
        )}
        
      </div>
    </AuthProvider>
  );
}

export default App;