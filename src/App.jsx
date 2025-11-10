import React from 'react';
// 1. Importamos el componente 'Outlet' de react-router-dom
// Este <Outlet /> es el "espacio en blanco" que se rellenará
import { Outlet } from 'react-router-dom'; 

import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Este componente App ahora actúa como el 'Layout' principal
function App() {
  return (
    // 'min-h-screen' = Alto mínimo de la pantalla
    // 'flex flex-col' = Layout vertical
    <div className="min-h-screen flex flex-col bg-brand-dark">
      
      {/* Siempre mostramos el Header */}
      <Header />

      {/* Contenido Principal */}
      {/* 'flex-grow' = Ocupa el espacio restante entre Header y Footer */}
      {/* 'container mx-auto...' = Centra el contenido de la página */}
      <main className="flex-grow container mx-auto px-6 py-8">
        
        {/* 2. Aquí es donde se renderizarán nuestras páginas */}
        {/* <Outlet /> le dice a React Router: "Carga aquí 
            HomePage, MoviesPage, etc., según la URL" */}
        <Outlet />
        
      </main>

      {/* Siempre mostramos el Footer */}
      <Footer />

    </div>
  );
}

export default App;