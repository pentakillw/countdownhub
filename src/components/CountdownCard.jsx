import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin } from 'lucide-react';

function CountdownCard({ item }) {
  const { id, title, type, release_date, platform, image_url } = item;

  const [daysLeft, setDaysLeft] = useState(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const releaseDate = new Date(release_date);
      today.setHours(0, 0, 0, 0);
      releaseDate.setHours(0, 0, 0, 0);
      const diffTime = releaseDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
      if (diffDays < 0) {
        setIsPast(true);
      } else {
        setIsPast(false);
      }
    };
    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60 * 24); 
    return () => clearInterval(interval);
  }, [release_date]);

  const formatType = (type) => {
    if (type === 'movie') return 'Película';
    if (type === 'tv') return 'Serie';
    return type;
  };

  if (daysLeft === null) {
    return null; 
  }

  let accentColorClass = 'text-action-primary'; // Azul por defecto
  if (type === 'tv') {
    accentColorClass = 'text-deco-verde-1'; // Verde para series
  }

  return (
    <Link 
      to={`/app/event/${id}`}
      // --- CORRECCIÓN: Borde cambiado a gris muy claro (t900) ---
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group border border-gray-t900 ${
        isPast ? 'opacity-70 hover:opacity-100' : ''
      }`}
    >
      
      <div className="h-48 w-full overflow-hidden bg-strong">
        <img 
          src={image_url} 
          alt={`Póster de ${title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x281/0C0D0F/E6E7EB?text=ClicTimes"; }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        
        <div className="flex justify-between items-center mb-2 text-sm font-medium">
          <span className={`font-bold ${accentColorClass}`}>
            {formatType(type)}
          </span>
          <span className="text-subtle">{platform}</span>
        </div>

        <h3 className="text-lg font-bold text-default mb-3">
          {title}
        </h3>

        <div className="flex-grow" />

        {/* --- CORRECCIÓN: Borde interno cambiado a gris muy claro (t900) --- */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-t900">
          
          <div className="text-subtle">
            <span className="text-xs block flex items-center">
              <MapPin size={12} className="mr-1 opacity-70" />
              Estreno MX:
            </span>
            <span className="text-sm font-medium">
              {new Date(release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          {isPast ? (
            <div className="text-right text-success flex items-center">
              <CheckCircle size={20} className="mr-1" />
              <span className="text-lg font-bold">
                Ya se estrenó
              </span>
            </div>
          ) : (
            <div className="text-right">
              <span className={`text-4xl font-black ${accentColorClass}`}>
                {daysLeft === 0 ? 'Hoy' : daysLeft}
              </span>
              <span className={`text-lg text-default opacity-80 ml-1 ${daysLeft === 0 ? 'hidden' : 'inline'}`}>
                {daysLeft === 1 ? 'Día' : 'Días'}
              </span>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
}

export default CountdownCard;