import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Calendar, Monitor, Film, PlayCircle, MapPin, Star, X, Eye, Search } from 'lucide-react';
import CountdownCard from '../components/CountdownCard';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { useWatchedHistory } from '../hooks/useWatchedHistory';

// --- ¡NUEVA VARIABLE DE ENTORNO! ---
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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

// --- Componente del Modal de Video ---
function VideoModal({ trailerKey, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el video cierre el modal
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
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
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

// --- Lógica de Búsqueda de Tráiler ---
const findBestTrailer = (videos) => {
  if (!videos || videos.length === 0) return null;
  const youtubeVideos = videos.filter(v => v.site === 'YouTube');
  
  // Prioridades
  const checks = [
    (v) => v.type === 'Trailer' && v.official === true,
    (v) => v.type === 'Trailer',
    (v) => v.type === 'Teaser' && v.official === true,
    (v) => v.type === 'Teaser',
    (v) => v.type === 'Clip' && v.official === true,
    (v) => v.type === 'Clip',
    (v) => v.type === 'Featurette',
  ];

  for (const check of checks) {
    const found = youtubeVideos.find(check);
    if (found) return found.key;
  }
  
  // Si falla todo, devuelve el primer video de YouTube
  return youtubeVideos.length > 0 ? youtubeVideos[0].key : null;
};


function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // --- ¡NUEVOS ESTADOS DE TRÁILER! ---
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const countdown = useCountdown(event?.release_date);
  const { user } = useAuth();

  // --- Hooks de "Mi Lista" y "Vistos" ---
  const { addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();
  const { addWatched, removeWatched, isWatched, loadingWatched } = useWatchedHistory();
  
  const eventIdAsNumber = Number(id);
  const isCurrentlyFavorite = isFavorite(eventIdAsNumber);
  const isCurrentlyWatched = isWatched(eventIdAsNumber);

  // --- Efecto 1: Cargar datos del Evento ---
  useEffect(() => {
    // Reseteamos estados al cambiar de ID
    setLoading(true);
    setError(null);
    setEvent(null);
    setRelatedEvents([]);
    setRelatedLoading(true);
    setTrailerKey(null);
    setLoadingTrailer(true);
    setIsModalOpen(false);

    const fetchEventAndTrailer = async () => {
      try {
        // --- Cargar Evento de Supabase ---
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        if (eventError) throw eventError;
        if (!eventData) throw new Error('Evento no encontrado');
        setEvent(eventData);

        // --- Cargar Tráiler de TMDB ---
        if (TMDB_API_KEY) {
          const apiType = eventData.type === 'tv' ? 'tv' : 'movie';
          const tmdbId = eventData.source_api_id.split('-')[1]; // Ej: "movie-123" -> "123"
          const trailerUrl = `https://api.themoviedb.org/3/${apiType}/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=es-MX,en-US`;
          
          const trailerResponse = await fetch(trailerUrl);
          if (trailerResponse.ok) {
            const videoData = await trailerResponse.json();
            const bestKey = findBestTrailer(videoData.results);
            setTrailerKey(bestKey);
          }
        }
      } catch (err) {
        console.error("Error al cargar evento o tráiler:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingTrailer(false);
      }
    };
    fetchEventAndTrailer();
  }, [id, TMDB_API_KEY]); // Depende de TMDB_API_KEY

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

  // --- ¡NUEVO MANEJADOR DE CLIC PARA EL TRÁILER! ---
  const handleTrailerClick = () => {
    if (loadingTrailer) return; // No hacer nada si está cargando
    
    if (trailerKey) {
      // Si tenemos un tráiler, abrimos el modal
      setIsModalOpen(true);
    } else {
      // Si NO tenemos tráiler, buscamos en YouTube
      const searchQuery = encodeURIComponent(`${event.title} ${event.type === 'tv' ? 'Serie' : 'Película'} Trailer`);
      const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
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
          to="/app" // <-- ¡RUTA CORREGIDA!
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

  // --- ¡NUEVA LÓGICA DE ESTILO Y TEXTO DEL BOTÓN! ---
  let trailerButtonText = 'Buscando...';
  let trailerButtonIcon = <PlayCircle size={20} className="mr-2" />;
  let trailerButtonClass = 'bg-subtle text-gray-t500 cursor-not-allowed'; // Estado de carga

  if (!loadingTrailer) {
    if (trailerKey) {
      trailerButtonText = 'Ver Tráiler';
      trailerButtonClass = 'bg-action-primary text-white hover:bg-action-primary-hover';
    } else {
      trailerButtonText = 'Buscar Tráiler';
      trailerButtonIcon = <Search size={20} className="mr-2" />; // Cambiamos el icono
      trailerButtonClass = 'bg-action-secondary text-white hover:bg-action-secondary-pressed'; // Botón gris clicable
    }
  }

  return (
    <>
      {isModalOpen && trailerKey && (
        <VideoModal trailerKey={trailerKey} onClose={() => setIsModalOpen(false)} />
      )}
    
      <div className="max-w-5xl mx-auto">
        
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
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                src={event.poster_image_url} 
                alt={`Póster de ${event.title}`}
                className="w-full h-auto object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x750/0C0D0F/E6E7EB?text=ClicTimes"; }}
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center w-full">
              <span 
                className={`inline-block w-auto px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                  event.type === 'tv' ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-action-primary'
                }`}
              >
                {eventInfo.icon} {eventInfo.label}
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-default mb-4">
                {event.title}
              </h1>

              <div className="flex items-center text-subtle text-md mb-2">
                <Calendar size={18} className="mr-2 flex-shrink-0" />
                <span className="flex items-center flex-wrap">
                  {releaseDate}
                  <span className="flex items-center ml-2 mt-1 md:mt-0 bg-muted text-subtle text-xs font-medium px-2 py-0.5 rounded-full">
                    <MapPin size={12} className="mr-1" />
                    Estreno MX
                  </span>
                </span>
              </div>
              <div className="flex items-center text-subtle text-md mb-6">
                <PlayCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{event.platform}</span>
              </div>

              {event.genres && event.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-default uppercase mb-2">Géneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.genres.map(genre => (
                      <span key={genre} className="inline-block bg-muted text-subtle text-xs font-medium px-3 py-1 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* --- ¡BOTONES DE ACCIÓN ACTUALIZADOS Y CORREGIDOS! --- */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                {/* Botón de Tráiler */}
                <button
                  onClick={handleTrailerClick} // <-- Nuevo manejador
                  disabled={loadingTrailer} // <-- Solo deshabilitado mientras carga
                  className={`flex-1 flex items-center justify-center text-lg font-medium py-3 px-5 rounded-lg transition-colors duration-200 shadow-md
                    ${trailerButtonClass}
                  `}
                >
                  {trailerButtonIcon}
                  {trailerButtonText}
                </button>
                
                {/* Botones de Usuario (si está logueado) */}
                {user && (
                  <div className="flex gap-3">
                    
                    {/* Botón de Guardar (Estrella) --- ¡CORREGIDO! --- */}
                    <button
                      onClick={handleFavoriteClick}
                      disabled={loadingFavorites}
                      className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50
                        ${isCurrentlyFavorite
                          ? 'bg-critical-subtle text-text-critical hover:bg-critical-subtle' // ¡Cambiado a Rosa/Rojo!
                          : 'bg-muted text-subtle hover:bg-subtle'
                        }`}
                      aria-label={isCurrentlyFavorite ? "Quitar de Mi Lista" : "Guardar en Mi Lista"}
                    >
                      <Star 
                        size={24} 
                        fill={isCurrentlyFavorite ? '#F6B5B6' : 'none'} // ¡Corregido! Relleno pálido (hex de bg-critical-subtle)
                      />
                    </button>
                    
                    {/* Botón de Visto (Ojo) --- ¡CORREGIDO! --- */}
                    <button
                      onClick={handleWatchedClick}
                      disabled={loadingWatched}
                      className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50
                        ${isCurrentlyWatched
                          ? 'bg-info-subtle text-text-info hover:bg-info-subtle' // Azul (está bien)
                          : 'bg-muted text-subtle hover:bg-subtle'
                        }`}
                      aria-label={isCurrentlyWatched ? "Quitar de Vistos" : "Marcar como Visto"}
                    >
                      <Eye 
                        size={24}
                        fill={isCurrentlyWatched ? '#85D1F6' : 'none'} // ¡Corregido! Relleno pálido (hex de bg-info-subtle)
                      />
                    </button>
                  </div>
                )}
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
          <p className="text-subtle leading-relaxed text-md">
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