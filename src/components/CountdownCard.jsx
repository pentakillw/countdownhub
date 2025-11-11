import React from 'react';
// ¡NUEVO! Importamos Link para hacer la tarjeta cliqueable
import { Link } from 'react-router-dom';

// Este componente es una sola tarjeta de cuenta regresiva
function CountdownCard({ item }) {
  const { id, title, type, release_date, platform, image_url } = item;

  // --- Lógica de la Cuenta Regresiva ---
  const calculateDaysLeft = () => {
    const today = new Date();
    const releaseDate = new Date(release_date);
    
    today.setHours(0, 0, 0, 0);
    releaseDate.setHours(0, 0, 0, 0);

    const diffTime = releaseDate.getTime() - today.getTime();

    if (diffTime < 0) {
      return { value: 'Estrenado', unit: '' };
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
       return { value: 'Hoy', unit: '' };
    }
    if (diffDays === 1) {
      return { value: '1', unit: 'Día' };
    }
    return { value: diffDays, unit: 'Días' };
  };

  const daysLeft = calculateDaysLeft();

  // Define el color del borde izquierdo según el tipo
  const getTypeColor = (type) => {
    switch (type) {
      case 'movie': return 'border-indigo-500';
      case 'tv': return 'border-teal-500';
      case 'game': return 'border-red-500';
      case 'sport': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };
  
  // Traduce el 'tipo' a español
  const formatType = (type) => {
    if (type === 'movie') return 'Película';
    if (type === 'tv') return 'Serie';
    if (type === 'game') return 'Videojuego';
    if (type === 'sport') return 'Deporte';
    return type;
  };

  // Define el color de la cuenta regresiva
  let countdownColor = 'text-brand-primary';
  if (daysLeft.value === 'Estrenado') {
    countdownColor = 'text-brand-accent';
  } else if (daysLeft.value === 'Hoy') {
    countdownColor = 'text-yellow-400';
  }

  // ¡CAMBIO! Envolvemos todo en un <Link>
  // Usamos el 'id' del evento (que viene de Supabase) para crear la URL
  return (
    <Link 
      to={`/event/${id}`} 
      className="bg-brand-secondary rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
    >
      {/* Imagen (ya estaba bien con 'backdrop_path') */}
      <div className="w-full aspect-video overflow-hidden">
        <img 
          src={image_url} 
          alt={`Póster de ${title}`} 
          className="object-cover h-full w-full" 
          loading="lazy"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Tipo y Plataforma */}
        <div className={`flex justify-between items-center mb-3 text-sm font-medium ${getTypeColor(type)} border-l-4 pl-2`}>
          <span className="text-brand-light opacity-80">{formatType(type)}</span>
          <span className="text-brand-primary font-semibold">{platform}</span>
        </div>

        {/* Título (sin altura fija) */}
        <h3 className="text-2xl font-bold text-brand-light mb-4">
          {title}
        </h3>

        {/* 'mt-auto' empuja esta sección al fondo de la tarjeta */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-700/50">
          
          {/* Fecha de Estreno */}
          <div className="text-brand-light opacity-70">
            <span className="text-xs block">Estreno:</span>
            <span className="text-sm font-medium">
              {new Date(release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          {/* Cuenta Regresiva */}
          <div className="text-right flex-shrink-0 ml-2">
            <span className={`text-4xl font-black ${countdownColor}`}>
              {daysLeft.value}
            </span>
            <span className="text-lg text-brand-light opacity-80 ml-1">{daysLeft.unit}</span>
          </div>
        </div>
      </div>
    </Link> // <-- Cerramos el Link
  );
}

export default CountdownCard;