import React from 'react';
import { Outlet } from 'react-router-dom'; 

import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Este componente App ahora actúa como el 'Layout' principal
function App() {
  return (
    // 'min-h-screen' = Alto mínimo de la pantalla
    // 'flex flex-col' = Layout vertical
    // Fondo principal ahora es 'brand-white'
    <div className="min-h-screen flex flex-col bg-brand-white">
      
      {/* Siempre mostramos el Header */}
      <Header />

      {/* Contenido Principal */}
      {/* 'flex-grow' = Ocupa el espacio restante entre Header y Footer */}
      {/* 'container mx-auto...' = Centra el contenido de la página */}
      <main className="flex-grow container mx-auto px-6 py-8">
        
        {/* Aquí es donde se renderizarán nuestras páginas (HomePage, DetailPage, etc.) */}
        <Outlet />
        
      </main>

      {/* Siempre mostramos el Footer */}
      <Footer />

    </div>
  );
}

export default App;