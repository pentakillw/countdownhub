import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Info, Play, Clock, CheckCircle, Tv, AlertCircle } from 'lucide-react';

function HeroFeature({ event }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [statusState, setStatusState] = useState('loading'); // 'upcoming', 'today', 'released'

  useEffect(() => {
    if (!event) return;

    const calculateTime = () => {
      const now = new Date();
      const releaseDate = new Date(event.release_date);
      const releaseDateMidnight = new Date(releaseDate);
      releaseDateMidnight.setHours(0,0,0,0);
      
      const nowMidnight = new Date();
      nowMidnight.setHours(0,0,0,0);

      const diff = releaseDate.getTime() - now.getTime();

      if (diff < 0 && nowMidnight.getTime() > releaseDateMidnight.getTime()) {
        setStatusState('released');
        setTimeLeft(null);
      } else if (nowMidnight.getTime() === releaseDateMidnight.getTime()) {
        setStatusState('today');
        setTimeLeft(null);
      } else {
        setStatusState('upcoming');
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event) return null;

  const { id, title, description, release_date, platform, image_url, poster_image_url, status } = event;

  const getPlatformColor = (platName) => {
    if (!platName) return "bg-gray-600";
    const lower = platName.toLowerCase();
    if (lower.includes('netflix')) return "bg-[#E50914]";
    if (lower.includes('disney')) return "bg-[#113CCF]";
    if (lower.includes('prime')) return "bg-[#00A8E1]";
    if (lower.includes('max') || lower.includes('hbo')) return "bg-[#002BE7]";
    if (lower.includes('apple')) return "bg-[#2c2c2c]";
    return "bg-brand-t500";
  };

  const renderTimer = () => {
    if (!timeLeft) return null;
    return (
      <div className="flex gap-2 sm:gap-4 mt-6 animate-in slide-in-from-bottom-4 duration-700">
        {[
          { value: timeLeft.days, label: 'DÍAS' },
          { value: timeLeft.hours, label: 'HRS' },
          { value: timeLeft.minutes, label: 'MIN' },
          { value: timeLeft.seconds, label: 'SEG' }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[70px] sm:min-w-[90px]">
            <span className="text-2xl sm:text-4xl font-black text-white tabular-nums leading-none">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-white/60 font-bold tracking-widest mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const isSplitSeason = status === 'Parte 2 en Camino';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-10 group bg-gray-900 min-h-[500px] md:min-h-[550px] flex items-end md:items-center">
      
      {/* Fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear group-hover:scale-110"
        style={{ backgroundImage: `url(${image_url || poster_image_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D0F] via-[#0C0D0F]/90 to-transparent md:bg-gradient-to-r md:from-[#0C0D0F] md:via-[#0C0D0F]/70 md:to-transparent"></div>
      </div>

      <div className="relative z-10 p-6 md:p-16 w-full md:max-w-4xl">
        
        {/* Badges Superiores */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-in fade-in duration-700">
            <span className={`${getPlatformColor(platform)} px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg text-white`}>
              {platform || 'STREAMING'}
            </span>
            
            {statusState === 'released' ? (
               <span className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md">
                  <CheckCircle size={14} /> Ya Disponible
               </span>
            ) : isSplitSeason ? (
               // --- ¡CORRECCIÓN! text-white para el badge parpadeante ---
               <span className="bg-green-500/20 border border-green-500/50 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md animate-pulse">
                  <CheckCircle size={14} /> PARTE 1 DISPONIBLE
               </span>
            ) : (
               <span className="bg-white/10 border border-white/20 text-white/90 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md">
                  <Calendar size={14} /> 
                  {new Date(release_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
               </span>
            )}
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white drop-shadow-2xl tracking-tight max-w-3xl">
          {title}
        </h1>

        {/* Descripción */}
        <p className="text-white/80 text-base sm:text-lg mb-8 line-clamp-3 max-w-2xl font-medium leading-relaxed drop-shadow-md">
          {description}
        </p>

        {statusState === 'upcoming' && (
           <div className="mb-8">
              <div className="flex items-center gap-2 text-white/90 font-bold uppercase tracking-widest text-sm mb-2">
                 <Clock size={16} className="text-action-primary" />
                 {isSplitSeason ? 'TIEMPO PARA PARTE 2' : 'TIEMPO RESTANTE'}
              </div>
              {renderTimer()}
           </div>
        )}

        {statusState === 'today' && (
           <div className="mb-8 inline-block">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">
                 ¡SE ESTRENA HOY!
              </span>
           </div>
        )}

        {/* Botones */}
        <div className="flex flex-wrap gap-4 mt-8">
          <Link 
            to={`/app/event/${id}`}
            className="bg-action-primary hover:bg-action-primary-hover text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,2,202,0.4)]"
          >
            {statusState === 'released' ? (
                <Play size={22} className="fill-current" />
            ) : (
                <Info size={22} />
            )}
            
            {statusState === 'released' ? (
                <span>Ver Dónde Streaming</span>
            ) : (
                <span>Ver Detalles</span>
            )}
          </Link>

          {statusState === 'released' && (
            <div className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-white/90 font-medium cursor-default">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Disponible Ahora</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HeroFeature;