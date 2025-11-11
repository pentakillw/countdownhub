import React from 'react';
import { Outlet } from 'react-router-dom'; 

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AuthProvider from './contexts/AuthContext.jsx';

// Este componente App ahora actúa como el 'Layout' principal
function App() {
  return (
    <AuthProvider>
      {/* --- ¡MIGRADO! --- */}
      {/* (Antes: bg-brand-white) */}
      <div className="min-h-screen flex flex-col bg-default">
        
        <Header />

        <main className="flex-grow container mx-auto px-6 py-8">
          <Outlet />
        </main>

        <Footer />

      </div>
    </AuthProvider>
  );
}

export default App;