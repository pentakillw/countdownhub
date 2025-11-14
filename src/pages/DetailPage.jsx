import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { Calendar, Monitor, Film, PlayCircle, MapPin, Star, X, Eye, Share2 } from 'lucide-react';
import CountdownCard from '../components/CountdownCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';
import { useWatchedHistory } from '../hooks/useWatchedHistory.js';

// --- Hook para el contador ---
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

// --- Ayudante para extraer el ID de video de una URL de YouTube ---
function getYouTubeID(url) {
  if (!url) return null;
  // Expresión regular corregida (sin escapes innecesarios)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// --- Componente del Modal de Video ---
function VideoModal({ trailerUrl, onClose }) {
  const videoId = getYouTubeID(trailerUrl);

  if (!videoId) {
    onClose();
    return null; 
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 z-50 text-white bg-gray-t100 rounded-full p-1.5 hover:bg-gray-t200 transition-colors"
          aria-label="Cerrar tráiler"
        >
          <X size={24} />
        </button>
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Tráiler oficial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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

  // --- Efecto 1: Cargar datos del Evento ---
  useEffect(() => {
    if (!id || isNaN(eventIdAsNumber)) {
      setError('ID de evento no válido.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setEvent(null);
    setRelatedEvents([]);
    setRelatedLoading(true);
    setIsModalOpen(false);
    const fetchEvent = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventIdAsNumber)
          .single();
        if (eventError) throw eventError;
        if (!eventData) throw new Error('Evento no encontrado');
        setEvent(eventData);
      } catch (err) {
        console.error("Error al cargar evento:", err);
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, eventIdAsNumber]);

  // --- Efecto 2: Cargar Relacionados ---
  useEffect(() => {
    if (!event || !event.genres || event.genres.length === 0) {
      setRelatedLoading(false);
      return;
    }
    const fetchRelated = async () => {
      setRelatedLoading(true);
      const today = new Date().toISOString();
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .overlaps('genres', event.genres)
          .neq('id', event.id)
          .gte('release_date', today)
          .order('release_date', { ascending: true })
          .limit(3);
        if (error) throw error;
        setRelatedEvents(data);
      } catch (err) {
        console.error("Error al cargar eventos relacionados:", err);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [event]);

  // --- Lógica de Botones ---
  const getEventDetails = (type) => {
    switch (type) {
      case 'movie': return { icon: <Film size={16} className="inline-block" />, label: 'Película' };
      case 'tv': return { icon: <Monitor size={16} className="inline-block" />, label: 'Serie' };
      default: return { icon: <Calendar size={16} className="inline-block" />, label: 'Evento' };
    }
  };
  const eventInfo = event ? getEventDetails(event.type) : {};

  const handleFavoriteClick = () => {
    if (isCurrentlyFavorite) {
      removeFavorite(eventIdAsNumber);
    } else {
      addFavorite(eventIdAsNumber);
    }
  };

  const handleWatchedClick = () => {
    if (isCurrentlyWatched) {
      removeWatched(eventIdAsNumber);
    } else {
      addWatched(eventIdAsNumber);
    }
  };

  const handleTrailerClick = () => {
    if (event && event.trailer_url) {
      setIsModalOpen(true);
    }
  };

  // --- Lógica para Compartir ---
  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `¡Mira el próximo estreno de ${event.title} en ClicTimes!`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };
  
  // --- Renderizado ---
  if (loading) {
    return <div className="text-center py-20 text-subtle text-lg">Cargando...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-critical mb-4">Error: Evento no encontrado</h2>
        <p className="text-subtle mb-6">{error}</p>
        <Link 
          to="/app" 
          className="text-action-primary font-medium hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }
  if (!event || !countdown) return null;

  const releaseDate = new Date(event.release_date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const hasTrailer = event && event.trailer_url;
  let trailerButtonText = hasTrailer ? 'Ver Tráiler' : 'Tráiler no disponible';
  let trailerButtonIcon = <PlayCircle size={20} className="mr-2" />;
  let trailerButtonClass = hasTrailer
    ? 'bg-action-primary text-white hover:bg-action-primary-hover'
    : 'bg-subtle text-gray-t500 cursor-not-allowed';

  return (
    <>
      {isModalOpen && event.trailer_url && (
        <VideoModal trailerUrl={event.trailer_url} onClose={() => setIsModalOpen(false)} />
      )}
      
      {showCopyMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-success text-white px-4 py-2 rounded-lg shadow-lg">
          ¡Enlace copiado al portapapeles!
        </div>
      )}
    
      <div className="max-w-5xl mx-auto">
        
        {/* --- Imagen de fondo --- */}
        <div className="w-full h-48 md:h-80 lg:h-96 relative">
          <div
            className="w-full h-full bg-cover bg-center rounded-lg shadow-lg"
            style={{ backgroundImage: `url(${event.image_url})` }}
            onError={(e) => { e.target.style.backgroundImage = "url('https://placehold.co/1200x500/0C0D0F/E6E7EB?text=ClicTimes')"; }}
          ></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-bg-default"></div>
        </div>

        <div className="relative p-6 -mt-20 md:-mt-32">
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
            {/* --- Imagen de póster --- */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                src={event.poster_image_url} 
                alt={`Póster de ${event.title}`}
                className="w-full h-auto object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x750/0C0D0F/E6E7EB?text=ClicTimes"; }}
              />
            </div>
            
            <div className="p-6 md:p-8 flex flex-col justify-center w-full">
              {/* --- Tipo, Título, Info --- */}
              <span 
                className={`inline-block w-auto px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                  event.type === 'tv' ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-action-primary'
                }`}
              >
                {eventInfo.icon} {eventInfo.label}
              </span>

              {/* --- ¡CORRECCIÓN DE FUENTE! (Móvil más pequeño) --- */}
              <h1 className="text-2xl md:text-4xl font-extrabold text-default mb-4">
                {event.title}
              </h1>

              {/* --- Sección de Info (Fecha, Plataforma) --- */}
              {/* --- ¡CORRECCIÓN DE FUENTE! (text-md -> text-base) --- */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center text-subtle text-base">
                  <Calendar size={18} className="mr-3 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-default font-medium">{releaseDate}</span>
                    <span className="flex items-center text-subtle text-xs font-medium">
                      <MapPin size={12} className="mr-1" />
                      Estreno MX
                    </span>
                  </div>
                </div>
                {/* --- ¡CORRECCIÓN DE FUENTE! (text-md -> text-base) --- */}
                <div className="flex items-center text-subtle text-base">
                  <PlayCircle size={18} className="mr-3 flex-shrink-0" />
                  <span className="text-default font-medium">
                    {event.platform || 'Plataforma no anunciada'}
                  </span>
                </div>
              </div>

              {/* --- Sección de Géneros (Píldoras) --- */}
              {event.genres && event.genres.length > 0 && (
                <div className="mb-6">
                  {/* --- ¡CORRECCIÓN DE FUENTE! (text-sm para el título) --- */}
                  <h3 className="text-sm font-semibold text-default uppercase mb-3">
                    Géneros
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* --- ¡CORRECCIÓN DE FUENTE! (text-xs para las píldoras) --- */}
                    {event.genres.map(genre => (
                      <span key={genre} className="inline-block bg-muted text-subtle text-xs font-medium px-3 py-1 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* --- Layout de Botones Corregido --- */}
              <div className="flex flex-col gap-3 mt-auto">
                {/* Botón de Tráiler (Siempre 100% ancho) */}
                <button
                  onClick={handleTrailerClick} 
                  disabled={!hasTrailer}
                  className={`flex w-full items-center justify-center text-lg font-medium py-3 px-5 rounded-lg transition-colors duration-200 shadow-md
                    ${trailerButtonClass}
                  `}
                >
                  {trailerButtonIcon}
                  {trailerButtonText}
                </button>
                
                {/* Fila secundaria de botones (Compartir, Lista, Visto) */}
                <div className="flex gap-3">
                  
                  {/* Botón de Compartir (Toma el espacio principal) */}
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center p-3 rounded-lg transition-colors duration-200 shadow-md bg-muted text-subtle hover:bg-subtle"
                    aria-label="Compartir"
                  >
                    <Share2 size={24} />
                    {/* Texto extra para móvil */}
                    <span className="sm:hidden ml-2 font-medium">Compartir</span>
                  </button>
                  
                  {/* Botones de Usuario (si está logueado) */}
                  {user && (
                    <>
                      <button
                        onClick={handleFavoriteClick}
                        disabled={loadingFavorites}
                        className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50
                          ${isCurrentlyFavorite
                            ? 'bg-critical-subtle text-text-critical hover:bg-critical-subtle' 
                            : 'bg-muted text-subtle hover:bg-subtle'
                          }`}
                        aria-label={isCurrentlyFavorite ? "Quitar de Mi Lista" : "Guardar en Mi Lista"}
                      >
                        <Star 
                          size={24} 
                          fill={isCurrentlyFavorite ? '#F6B5B6' : 'none'} 
                        />
                      </button>
                      
                      <button
                        onClick={handleWatchedClick}
                        disabled={loadingWatched}
                        className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50
                          ${isCurrentlyWatched
                            ? 'bg-info-subtle text-text-info hover:bg-info-subtle' 
                            : 'bg-muted text-subtle hover:bg-subtle'
                          }`}
                        aria-label={isCurrentlyWatched ? "Quitar de Vistos" : "Marcar como Visto"}
                      >
                        <Eye 
                          size={24}
                          fill={isCurrentlyWatched ? '#85D1F6' : 'none'} 
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- Cuenta Regresiva --- */}
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mt-8">
          {countdown.isPast ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-success">¡Ya se estrenó!</h2>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-default text-center mb-6">
                Cuenta Regresiva
              </h2>
              <div className="flex justify-center text-center space-x-4 md:space-x-10">
                <div className="w-20 md:w-28"><span className="text-4xl md:text-6xl font-extrabold text-action-primary block">{countdown.days}</span><span className="text-sm text-subtle uppercase">Días</span></div>
                <div className="w-20 md:w-28"><span className="text-4xl md:text-6xl font-extrabold text-action-primary block">{countdown.hours}</span><span className="text-sm text-subtle uppercase">Horas</span></div>
                <div className="w-20 md:w-28"><span className="text-4xl md:text-6xl font-extrabold text-action-primary block">{countdown.minutes}</span><span className="text-sm text-subtle uppercase">Minutos</span></div>
                <div className="w-20 md:w-28"><span className="text-4xl md:text-6xl font-extrabold text-subtle block">{countdown.seconds}</span><span className="text-sm text-subtle uppercase">Segundos</span></div>
              </div>
            </div>
          )}
        </div>

        {/* --- Sinopsis --- */}
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mt-8 mb-8">
          <h3 className="text-2xl font-bold text-default mb-4">Sinopsis</h3>
          {/* --- ¡CORRECCIÓN DE FUENTE! (text-base) --- */}
          <p className="text-subtle leading-relaxed text-base">
            {event.description || 'Sinopsis no disponible por el momento.'}
          </p>
        </div>

        {/* --- Relacionados --- */}
        {!relatedLoading && relatedEvents.length > 0 && (
          <div className="mt-8 mb-8">
            <h3 className="text-3xl font-bold text-default mb-6">
              También te podría interesar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedEvents.map(item => (
                <CountdownCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DetailPage;