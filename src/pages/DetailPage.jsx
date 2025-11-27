import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// CORRECCIÓN 1: Restauramos extensiones .js requeridas
import { supabase } from '../supabaseClient.js';
import { Calendar, Monitor, Film, PlayCircle, MapPin, Star, X, Eye, Share2, User, ChevronRight, Home, Clock } from 'lucide-react';
import CountdownCard from '../components/CountdownCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';
import { useWatchedHistory } from '../hooks/useWatchedHistory.js';

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!targetDate) return;
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPast: false,
      });
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

function getYouTubeID(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function VideoModal({ trailerUrl, onClose }) {
  const videoId = getYouTubeID(trailerUrl);
  if (!videoId) { onClose(); return null; }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in" onClick={onClose}>
      <div className="relative w-full max-w-5xl bg-black rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/10" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-white/20 rounded-full p-2 transition-all backdrop-blur-sm">
          <X size={24} />
        </button>
        <div className="aspect-video">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} title="Tráiler" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
}

function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const countdown = useCountdown(event?.release_date);
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();
  const { addWatched, removeWatched, isWatched, loadingWatched } = useWatchedHistory();
  
  const eventIdAsNumber = Number(id); 
  const isCurrentlyFavorite = isFavorite(eventIdAsNumber);
  const isCurrentlyWatched = isWatched(eventIdAsNumber);

  useEffect(() => {
    if (event) document.title = `${event.title} | ClicTimes`;
    else document.title = 'Cargando... | ClicTimes';
    return () => { document.title = 'ClicTimes'; };
  }, [event]);

  useEffect(() => {
    if (!id || isNaN(eventIdAsNumber)) {
      setError('ID de evento no válido.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setEvent(null);
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').eq('id', eventIdAsNumber).single();
        if (error) throw error;
        if (!data) throw new Error('Evento no encontrado');
        setEvent(data);
      } catch (err) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchEvent();
  }, [id, eventIdAsNumber]);

  useEffect(() => {
    if (!event || !event.genres || event.genres.length === 0) { setRelatedLoading(false); return; }
    const fetchRelated = async () => {
      setRelatedLoading(true);
      const today = new Date().toISOString();
      try {
        const { data, error } = await supabase.from('events').select('*').overlaps('genres', event.genres).neq('id', event.id).gte('release_date', today).order('release_date', { ascending: true }).limit(3);
        if (error) throw error;
        setRelatedEvents(data);
      } catch (err) { console.error(err); } 
      finally { setRelatedLoading(false); }
    };
    fetchRelated();
  }, [event]);

  const Breadcrumbs = () => (
    <nav className="flex items-center text-sm text-text-subtle mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link to="/app" className="hover:text-action-primary flex items-center transition-colors">
        <Home size={16} className="mr-1" /> Inicio
      </Link>
      <ChevronRight size={16} className="mx-2 text-border-strong opacity-30" />
      <Link to={event.type === 'tv' ? '/app/series' : '/app/movies'} className="hover:text-action-primary transition-colors">
        {event.type === 'tv' ? 'Series' : 'Películas'}
      </Link>
      <ChevronRight size={16} className="mx-2 text-border-strong opacity-30" />
      <span className="text-text-default font-medium truncate max-w-[200px]">{event.title}</span>
    </nav>
  );

  const getEventDetails = (type) => {
    switch (type) {
      case 'movie': return { icon: <Film size={16} className="inline-block" />, label: 'Película' };
      case 'tv': return { icon: <Monitor size={16} className="inline-block" />, label: 'Serie' };
      default: return { icon: <Calendar size={16} className="inline-block" />, label: 'Evento' };
    }
  };
  const eventInfo = event ? getEventDetails(event.type) : {};
  const handleFavoriteClick = () => isCurrentlyFavorite ? removeFavorite(eventIdAsNumber) : addFavorite(eventIdAsNumber);
  const handleWatchedClick = () => isCurrentlyWatched ? removeWatched(eventIdAsNumber) : addWatched(eventIdAsNumber);
  const handleTrailerClick = () => event && event.trailer_url && setIsModalOpen(true);
  
  const handleShare = async () => {
    const shareData = { title: event.title, text: `¡Mira el próximo estreno de ${event.title} en ClicTimes!`, url: window.location.href };
    try {
      if (navigator.share && navigator.canShare(shareData)) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); setShowCopyMessage(true); setTimeout(() => setShowCopyMessage(false), 3000); }
    } catch (err) { console.error("Error al compartir:", err); }
  };

  if (loading) return <div className="text-center py-20 text-text-subtle animate-pulse">Cargando detalles...</div>;
  if (error) return <div className="text-center py-20 text-critical">Error: {error}</div>;
  if (!event || !countdown) return null;

  const releaseDate = new Date(event.release_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hasTrailer = event && event.trailer_url;
  const trailerButtonClass = hasTrailer ? 'bg-action-primary text-text-on-accent hover:bg-action-primary-hover hover:scale-105 shadow-lg shadow-action-primary/30' : 'bg-bg-subtle text-text-subtle cursor-not-allowed';

  return (
    <>
      {isModalOpen && event.trailer_url && <VideoModal trailerUrl={event.trailer_url} onClose={() => setIsModalOpen(false)} />}
      {showCopyMessage && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-success text-white px-6 py-3 rounded-full shadow-xl font-bold animate-in slide-in-from-top-5 flex items-center"><Star className="mr-2 fill-current" size={18} /> ¡Enlace copiado!</div>}
    
      <div className="max-w-5xl mx-auto animate-in fade-in duration-700 pb-20">
        
        <Breadcrumbs />

        {/* --- HERO IMAGE --- */}
        <div className="w-full h-[50vh] md:h-[60vh] relative rounded-3xl overflow-hidden shadow-2xl mb-10 group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110" style={{ backgroundImage: `url(${event.image_url})` }}></div>
          {/* Degradado para integración suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-default via-bg-default/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-60"></div>
        </div>

        <div className="relative px-4 md:px-10 -mt-40 md:-mt-64 z-10">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            
            {/* Poster Flotante */}
            <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0 relative group">
              <div className="absolute inset-0 bg-black/20 blur-xl rounded-2xl transform translate-y-4"></div>
              <img 
                src={event.poster_image_url} 
                alt={`Póster de ${event.title}`}
                className="w-full h-auto rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 dark:border-white/5 relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2"
                onError={(e) => { e.target.src="https://placehold.co/500x750/0C0D0F/E6E7EB?text=Sin+Imagen"; }}
              />
              <div className="absolute -top-3 -right-3 z-20 bg-action-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                 {eventInfo.icon} <span className="ml-1">{eventInfo.label}</span>
              </div>
            </div>
            
            <div className="flex-1 pb-4 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black text-text-default mb-4 leading-tight drop-shadow-sm">
                {event.title}
              </h1>

              {/* Tags de Género */}
              {event.genres && event.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {event.genres.map(genre => (
                    <span key={genre} className="px-3 py-1 rounded-full bg-bg-muted/80 backdrop-blur-md border border-border-default text-text-subtle text-xs font-bold uppercase tracking-wider hover:border-action-primary hover:text-action-primary transition-colors cursor-default">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center md:justify-start">
                <button onClick={handleTrailerClick} disabled={!hasTrailer} className={`flex items-center justify-center py-3.5 px-8 rounded-full font-bold transition-all transform active:scale-95 ${trailerButtonClass}`}>
                  <PlayCircle size={22} className="mr-2 fill-current" /> {hasTrailer ? 'Ver Tráiler' : 'No Disponible'}
                </button>
                
                <div className="flex gap-2 justify-center">
                    <button onClick={handleShare} className="p-3.5 rounded-full bg-bg-muted hover:bg-bg-subtle text-text-default transition-colors border border-transparent hover:border-border-strong" title="Compartir">
                        <Share2 size={22} />
                    </button>
                    {user && (
                        <>
                        <button onClick={handleFavoriteClick} disabled={loadingFavorites} className={`p-3.5 rounded-full transition-colors border ${isCurrentlyFavorite ? 'bg-critical-subtle/20 text-text-critical border-text-critical' : 'bg-bg-muted hover:bg-bg-subtle text-text-subtle border-transparent'}`} title="Favoritos">
                            <Star size={22} fill={isCurrentlyFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={handleWatchedClick} disabled={loadingWatched} className={`p-3.5 rounded-full transition-colors border ${isCurrentlyWatched ? 'bg-info-subtle/20 text-text-info border-text-info' : 'bg-bg-muted hover:bg-bg-subtle text-text-subtle border-transparent'}`} title="Visto">
                            <Eye size={22} fill={isCurrentlyWatched ? 'currentColor' : 'none'} />
                        </button>
                        </>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* --- CONTADOR MODERNO "CLEAN TYPOGRAPHY" --- */}
          {!countdown.isPast && (
             <div className="mt-16 mb-12 relative">
                {/* Glow de fondo atmosférico */}
                <div className="absolute inset-0 bg-brand-t500/20 blur-[100px] rounded-full pointer-events-none opacity-40 dark:opacity-30"></div>
                
                {/* CONTENEDOR PRINCIPAL: Minimalista, sin bordes pesados ni cajas internas */}
                <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[2rem] p-8 md:p-12 text-center shadow-xl dark:shadow-2xl overflow-hidden">
                    
                    {/* Header sutil */}
                    <div className="flex items-center justify-center gap-3 mb-12 opacity-70">
                        <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-current text-text-subtle"></div>
                        <h2 className="text-text-default text-xs md:text-sm uppercase tracking-[0.4em] font-extrabold flex items-center gap-3">
                            <Clock size={14} className="text-action-primary" />
                            Tiempo Restante
                        </h2>
                        <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-current text-text-subtle"></div>
                    </div>

                    {/* GRID DE NÚMEROS LIMPIOS (Sin cajas grises) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 max-w-5xl mx-auto">
                        {[
                            { val: countdown.days, label: 'DÍAS' },
                            { val: countdown.hours, label: 'HRS' },
                            { val: countdown.minutes, label: 'MIN' },
                            { val: countdown.seconds, label: 'SEG' }
                        ].map((time, i) => (
                            <div key={i} className="flex flex-col items-center relative group">
                                {/* Número Gigante: Negro sólido en light / Blanco puro en dark */}
                                <span className="text-6xl md:text-8xl font-black text-[#0C0D0F] dark:text-white tabular-nums tracking-tighter leading-none mb-1 transition-transform duration-500 group-hover:scale-110 group-hover:text-action-primary">
                                    {String(time.val).padStart(2,'0')}
                                </span>
                                
                                {/* Etiqueta minimalista */}
                                <span className="text-[10px] md:text-xs font-bold text-text-subtle uppercase tracking-[0.2em] mt-2 group-hover:text-action-primary transition-colors">
                                    {time.label}
                                </span>
                                
                                {/* Separador visual (opcional, solo en desktop) */}
                                {i < 3 && (
                                    <div className="hidden md:block absolute right-[-10%] top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-border-default to-transparent opacity-50"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            
            {/* Columna Izquierda: Detalles */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Info Grid (Fecha, Plataforma, Director) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-bg-muted p-5 rounded-2xl border border-border-default flex items-center shadow-sm hover:border-action-primary/30 transition-colors">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mr-4 text-action-primary">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-subtle uppercase font-bold tracking-wide">Estreno</p>
                            <p className="text-text-default font-semibold">{releaseDate}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-bg-muted p-5 rounded-2xl border border-border-default flex items-center shadow-sm hover:border-action-primary/30 transition-colors">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl mr-4 text-purple-500">
                            <PlayCircle size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-subtle uppercase font-bold tracking-wide">Plataforma</p>
                            <p className="text-text-default font-semibold">{event.platform || 'TBA'}</p>
                        </div>
                    </div>
                    {event.director && (
                        <div className="bg-white dark:bg-bg-muted p-5 rounded-2xl border border-border-default flex items-center shadow-sm sm:col-span-2 hover:border-action-primary/30 transition-colors">
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mr-4 text-green-500">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle uppercase font-bold tracking-wide">{event.type === 'tv' ? 'Creador(a)' : 'Director(a)'}</p>
                                <p className="text-text-default font-semibold">{event.director}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-bg-muted p-8 rounded-3xl shadow-sm border border-border-default">
                    <h3 className="text-xl font-bold text-text-default mb-4 flex items-center">
                        <Film className="mr-2 text-action-primary" size={20} /> Sinopsis
                    </h3>
                    <p className="text-text-subtle leading-loose text-lg">
                        {event.description || 'No hay sinopsis disponible por el momento.'}
                    </p>
                </div>

                {event.cast_detailed && event.cast_detailed.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-text-default mb-4 px-2 flex items-center gap-2">
                            <User size={18} className="text-text-subtle" /> Reparto
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {event.cast_detailed.map(actor => (
                                <div key={actor.id || actor.name} className="bg-white dark:bg-bg-muted rounded-xl p-3 shadow-sm border border-border-default hover:border-action-primary transition-all flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-bg-subtle flex-shrink-0 border border-border-default group-hover:border-action-primary transition-colors">
                                        {actor.profile_path ? (
                                            <img src={actor.profile_path} alt={actor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-full h-full p-2 text-text-muted" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm text-text-default truncate group-hover:text-action-primary transition-colors">{actor.name}</p>
                                        <p className="text-[10px] text-text-subtle truncate uppercase font-medium">{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Columna Derecha: Relacionados */}
            <div className="mt-8 md:mt-0">
                 <div className="sticky top-24">
                     <h3 className="text-lg font-bold text-text-default mb-4 px-2">También te podría interesar</h3>
                     <div className="space-y-4">
                        {relatedLoading ? (
                            <div className="bg-bg-muted/50 p-8 rounded-2xl text-center animate-pulse">
                                <div className="h-4 bg-border-default rounded w-1/2 mx-auto mb-2"></div>
                                <div className="h-3 bg-border-default rounded w-1/3 mx-auto"></div>
                            </div>
                        ) : relatedEvents.length > 0 ? (
                            relatedEvents.map(item => (
                                <Link key={item.id} to={`/app/event/${item.id}`} className="flex gap-4 bg-white dark:bg-bg-muted p-3 rounded-2xl shadow-sm border border-border-default hover:shadow-lg hover:-translate-y-1 transition-all group">
                                    <img src={item.poster_image_url} className="w-20 h-28 object-cover rounded-xl bg-bg-subtle shadow-inner" alt="" />
                                    <div className="py-1 flex-1 min-w-0">
                                        <h4 className="font-bold text-text-default text-sm group-hover:text-action-primary transition-colors line-clamp-2 leading-tight mb-1">{item.title}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-bg-subtle text-text-subtle px-2 py-0.5 rounded-md">{item.type === 'movie' ? 'Película' : 'Serie'}</span>
                                        </div>
                                        <span className="text-xs text-text-subtle block flex items-center">
                                            <Calendar size={12} className="mr-1" /> {new Date(item.release_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="bg-bg-subtle/30 p-6 rounded-2xl text-center text-sm text-text-subtle border border-dashed border-border-default">
                                <Film size={24} className="mx-auto mb-2 opacity-50" />
                                No encontramos eventos similares por ahora.
                            </div>
                        )}
                     </div>
                 </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default DetailPage;