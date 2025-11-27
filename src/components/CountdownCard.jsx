import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin, Tv, Film, Heart, Eye } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites.js';
import { useWatchedHistory } from '../hooks/useWatchedHistory.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../contexts/ToastContext.jsx';

function CountdownCard({ item }) {
  const { id, title, type, release_date, platform, image_url } = item;
  const [daysLeft, setDaysLeft] = useState(null);
  const [isPast, setIsPast] = useState(false);

  // Hooks para acciones rápidas
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isWatched, addWatched, removeWatched } = useWatchedHistory();
  const { addToast } = useToast();
  
  // --- ¡CORRECCIÓN! Eliminamos 'useNavigate' ya que no se usa ---

  const isFav = isFavorite(Number(id));
  const isSeen = isWatched(Number(id));

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const releaseDateObj = new Date(release_date);
      today.setHours(0, 0, 0, 0);
      releaseDateObj.setHours(0, 0, 0, 0);
      const diffTime = releaseDateObj.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
      setIsPast(diffDays < 0);
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

  // --- Lógica de Acciones Rápidas ---
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
        addToast('Inicia sesión para guardar favoritos', 'error');
        return;
    }

    if (isFav) {
        removeFavorite(Number(id));
        addToast('Eliminado de Mi Lista', 'info');
    } else {
        addFavorite(Number(id));
        addToast('¡Guardado en Mi Lista!', 'success');
    }
  };

  const handleToggleWatched = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
        addToast('Inicia sesión para marcar vistos', 'error');
        return;
    }

    if (isSeen) {
        removeWatched(Number(id));
        addToast('Marcado como no visto', 'info');
    } else {
        addWatched(Number(id));
        addToast('¡Marcado como visto!', 'success');
    }
  };

  if (daysLeft === null) return null; 

  const getPlatformStyle = (platName) => {
    if (!platName) return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    const lower = platName.toLowerCase();
    if (lower.includes('netflix')) return "bg-[#E50914] text-white";
    if (lower.includes('disney')) return "bg-[#113CCF] text-white";
    if (lower.includes('prime')) return "bg-[#00A8E1] text-white";
    if (lower.includes('max') || lower.includes('hbo')) return "bg-[#002BE7] text-white";
    if (lower.includes('apple')) return "bg-[#2c2c2c] text-white";
    if (lower.includes('paramount')) return "bg-[#0064FF] text-white";
    return "bg-brand-subtle text-action-primary"; 
  };

  const platformClass = getPlatformStyle(platform);
  let accentColorClass = type === 'tv' ? 'text-deco-verde-1' : 'text-action-primary';

  return (
    <Link 
      to={`/app/event/${id}`}
      className={`bg-white dark:bg-bg-muted rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group border border-border-default h-full relative ${
        isPast ? 'opacity-90 hover:opacity-100' : ''
      }`}
    >
      <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
            onClick={handleToggleWatched}
            className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-all transform hover:scale-110 ${
                isSeen 
                ? 'bg-info-subtle text-text-info' 
                : 'bg-black/40 text-white hover:bg-white hover:text-text-info'
            }`}
            title={isSeen ? "Ya visto" : "Marcar como visto"}
        >
            <Eye size={18} fill={isSeen ? "currentColor" : "none"} />
        </button>
        <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-all transform hover:scale-110 ${
                isFav 
                ? 'bg-critical-subtle text-text-critical' 
                : 'bg-black/40 text-white hover:bg-white hover:text-text-critical'
            }`}
            title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="relative h-48 w-full overflow-hidden bg-bg-strong">
        <img 
          src={image_url} 
          alt={`Póster de ${title}`}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSeen ? 'grayscale-[0.8]' : ''}`}
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x281/0C0D0F/E6E7EB?text=ClicTimes"; }}
        />
        <div className="absolute top-3 left-3">
             <span className="backdrop-blur-md bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center border border-white/20">
                {type === 'movie' ? <Film size={12} className="mr-1"/> : <Tv size={12} className="mr-1"/>}
                {formatType(type)}
             </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        <div className="absolute -top-4 right-4 z-10">
             <span className={`shadow-lg px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${platformClass}`}>
                {platform || 'TBA'}
             </span>
        </div>

        <div className="mt-2 mb-1">
            <h3 className={`text-lg font-bold text-text-default leading-tight line-clamp-2 group-hover:text-action-primary transition-colors ${isSeen ? 'line-through decoration-text-subtle opacity-70' : ''}`}>
            {title}
            </h3>
        </div>

        <div className="flex-grow" />

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-border-default border-dashed">
          <div className="text-text-subtle">
            <span className="text-xs block flex items-center opacity-80 mb-0.5">
              <MapPin size={12} className="mr-1" />
              Estreno:
            </span>
            <span className="text-sm font-semibold text-text-default">
              {new Date(release_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          
          {isPast ? (
            <div className="text-right text-success flex items-center bg-success-subtle/20 px-2 py-1 rounded-lg">
              <CheckCircle size={16} className="mr-1.5" />
              <span className="text-sm font-bold">Disponible</span>
            </div>
          ) : (
            <div className="text-right">
              <span className={`text-3xl font-black ${accentColorClass} leading-none block`}>
                {daysLeft === 0 ? 'Hoy' : daysLeft}
              </span>
              <span className={`text-xs font-bold text-text-subtle uppercase tracking-wide ${daysLeft === 0 ? 'hidden' : 'inline'}`}>
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