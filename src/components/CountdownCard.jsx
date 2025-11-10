import React from 'react';
// import { Clock } from 'lucide-react'; // 1. Desactivado temporalmente para pruebas

// Este componente es una sola tarjeta de cuenta regresiva
function CountdownCard({ item }) {
  const { title, type, release_date, platform, image_url } = item;

  // --- Lógica de la Cuenta Regresiva ---
  const calculateDaysLeft = () => {
    const today = new Date();
    const releaseDate = new Date(release_date);
    const diffTime = releaseDate.getTime() - today.getTime();
    
    if (diffTime <= 0) {
      return { value: 'Estrenado', unit: '' };
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return { value: '1', unit: 'Día' };
    }
    return { value: diffDays, unit: 'Días' };
  };

  const daysLeft = calculateDaysLeft();

  const getTypeColor = (type) => {
    switch (type) {
      case 'movie': return 'border-indigo-500';
      case 'tv': return 'border-teal-500';
      case 'game': return 'border-red-500';
      default: return 'border-gray-500';
    }
  };
  
  const formatType = (type) => {
    if (type === 'movie') return 'Película';
    if (type === 'tv') return 'Serie';
    if (type === 'game') return 'Videojuego';
    return type;
  };

  return (
    <div className="bg-brand-secondary rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
      
      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${image_url})` }}>
        {/* Imagen de Fondo */}
      </div>

      <div className="p-5">
        
        <div className={`flex justify-between items-center mb-3 text-sm font-medium ${getTypeColor(type)} border-l-4 pl-2`}>
          <span className="text-brand-light opacity-80">{formatType(type)}</span>
          <span className="text-brand-primary font-semibold">{platform}</span>
        </div>

        <h3 className="text-2xl font-bold text-brand-light mb-4 h-16">{title}</h3>

        <div className="flex items-end justify-between">
          
          <div className="text-brand-light opacity-70">
            <span className="text-xs block">Estreno:</span>
            <span className="text-sm font-medium">{new Date(release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          
          <div className="text-right">
            <span className={`text-4xl font-black ${daysLeft.value === 'Estrenado' ? 'text-brand-accent' : 'text-brand-primary'}`}>
              {daysLeft.value}
            </span>
            <span className="text-lg text-brand-light opacity-80 ml-1">{daysLeft.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountdownCard;