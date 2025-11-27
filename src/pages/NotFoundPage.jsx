import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="bg-bg-warning-subtle/20 p-6 rounded-full mb-6 animate-bounce">
        <AlertTriangle size={64} className="text-text-warning" />
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black text-text-default mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-text-default mb-6">Página no encontrada</h2>
      
      <p className="text-text-subtle text-lg max-w-md mb-10 leading-relaxed">
        Parece que te has perdido en el multiverso. La página que buscas no existe o ha sido movida a otra dimensión.
      </p>
      
      <Link 
        to="/app" 
        className="flex items-center gap-2 px-8 py-4 bg-action-primary text-text-on-accent rounded-xl font-bold hover:bg-action-primary-hover transition-all hover:scale-105 shadow-lg hover:shadow-action-primary/20"
      >
        <Home size={20} />
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFoundPage;