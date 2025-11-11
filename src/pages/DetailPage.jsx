import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
// --- ¡NUEVO ICONO! ---
import { Calendar, Monitor, Film, PlayCircle, MapPin, Star, X, Eye } from 'lucide-react';
import CountdownCard from '../components/CountdownCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';
// --- ¡NUEVO HOOK! ---
import { useWatchedHistory } from '../hooks/useWatchedHistory.js';

// --- Hook de la Cuenta Regresiva (sin cambios) ---
function useCountdown(targetDate) {
  // ... (código existente del hook) ...
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

// --- Componente de la Página de Detalle (ACTUALIZADO) ---
function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerLoading, setIsTrailerLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const countdown = useCountdown(event?.release_date);
  const { user } = useAuth();
  const eventIdAsNumber = Number(id);

  // --- Lógica de Hooks (Favoritos + Vistos) ---
  const { addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();
  const { addWatched, removeWatched, isWatched, loadingWatched } = useWatchedHistory(); // <-- ¡NUEVO!
  
  const isCurrentlyFavorite = isFavorite(eventIdAsNumber);
  const isCurrentlyWatched = isWatched(eventIdAsNumber); // <-- ¡NUEVO!

  // --- Efecto 1: Cargar Evento (sin cambios) ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    setEvent(null);
    setRelatedEvents([]);
    setRelatedLoading(true);
    setIsTrailerLoading(true);
    setTrailerKey(null);
    setIsModalOpen(false);

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) throw new Error('Evento no encontrado');
        setEvent(data);
      } catch (err) {
        console.error("Error al cargar evento:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // --- Efecto 2: Cargar Relacionados (sin cambios) ---
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

  // --- Efecto 3: Cargar Tráiler (sin cambios) ---
  useEffect(() => {
    if (!event || !event.source_api_id) return; 

    const fetchTrailer = async () => {
      setIsTrailerLoading(true);
      const [type, tmdbId] = event.source_api_id.split('-');
      if (!type || !tmdbId) {
          setIsTrailerLoading(false);
          return;
      }
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (!apiKey) {
          console.error("Error: VITE_TMDB_API_KEY no está configurada en .env.local");
          setIsTrailerLoading(false);
          return;
      }
      const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${apiKey}&language=es-MX,en-US`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudieron cargar los videos");
        const data = await res.json();
        const videos = data.results || [];
        const officialTrailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official === true);
        const anyTrailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const anyTeaser = videos.find(v => v.type === 'Teaser' && v.site === 'YouTube');
        const firstVideo = videos.find(v => v.site === 'YouTube');
        const foundVideo = officialTrailer || anyTrailer || anyTeaser || firstVideo;
        if (foundVideo) {
          setTrailerKey(foundVideo.key);
        }
      } catch (err) {
        console.error("Error al cargar el tráiler:", err);
      } finally {
        setIsTrailerLoading(false);
      }
    };
    fetchTrailer();
  }, [event]);

  // --- Lógica de UI (sin cambios) ---
  const getEventDetails = (type) => {
    switch (type) {
      case 'movie': return { icon: <Film size={16} className="inline-block" />, label: 'Película' };
      case 'tv': return { icon: <Monitor size={16} className="inline-block" />, label: 'Serie' };
      default: return { icon: <Calendar size={16} className="inline-block" />, label: 'Evento' };
    }
  };
  const eventInfo = event ? getEventDetails(event.type) : {};

  // --- ¡LÓGICA DE BOTONES ACTUALIZADA! ---
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
  // --- Fin de Lógica de Botones ---


  // --- Renderizado de Carga y Error (sin cambios) ---
  if (loading) {
    return <div className="text-center py-20 text-subtle text-lg">Cargando...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-critical mb-4">Error: Evento no encontrado</h2>
        <p className="text-subtle mb-6">{error}</p>
        <Link to="/app" className="text-action-primary font-medium hover:underline">Volver al inicio</Link>
      </div>
    );
  }
  if (!event || !countdown) return null;

  const releaseDate = new Date(event.release_date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="max-w-5xl mx-auto">
      
      {/* --- Backdrop (sin cambios) --- */}
      <div className="w-full h-48 md:h-80 lg:h-96 relative">
        <div
          className="w-full h-full bg-cover bg-center rounded-lg shadow-lg"
          style={{ backgroundImage: `url(${event.image_url})` }}
          onError={(e) => { e.target.style.backgroundImage = "url('https://placehold.co/1200x500/0C0D0F/E6E7EB?text=ClicTimes')"; }}
        ></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-bg-default"></div>
      </div>

      {/* --- Info Principal (sin cambios) --- */}
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
          
          <div className="p-6 md:p-8 flex flex-col justify-center">
            
            {/* --- SECCIÓN DE BOTONES DE ACCIÓN (ACTUALIZADA) --- */}
            <div className="flex justify-between items-start mb-3">
              <span 
                className={`inline-block w-auto px-3 py-1 rounded-full text-sm font-semibold ${
                  event.type === 'tv' ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-action-primary'
                }`}
              >
                {eventInfo.icon} {eventInfo.label}
              </span>
              
              {/* Contenedor para los botones de usuario */}
              {user && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFavoriteClick}
                    disabled={loadingFavorites}
                    className={`flex items-center text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200 disabled:opacity-50 ${
                      isCurrentlyFavorite
                      ? 'bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/40'
                      : 'bg-muted text-subtle hover:bg-subtle'
                    }`}
                    aria-label={isCurrentlyFavorite ? "Quitar de Mi Lista" : "Guardar en Mi Lista"}
                  >
                    <Star 
                      size={16} 
                      className="mr-1.5" 
                      fill={isCurrentlyFavorite ? 'currentColor' : 'none'} 
                    />
                    {loadingFavorites ? '...' : (isCurrentlyFavorite ? 'Guardado' : 'Guardar')}
                  </button>
                  
                  {/* --- ¡NUEVO BOTÓN DE VISTO! --- */}
                  <button
                    onClick={handleWatchedClick}
                    disabled={loadingWatched}
                    className={`flex items-center text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200 disabled:opacity-50 ${
                      isCurrentlyWatched
                      ? 'bg-deco-verde-1/20 text-deco-verde-1 hover:bg-deco-verde-1/40'
                      : 'bg-muted text-subtle hover:bg-subtle'
                    }`}
                    aria-label={isCurrentlyWatched ? "Quitar de Vistos" : "Marcar como Visto"}
                  >
                    <Eye 
                      size={16} 
                      className="mr-1.5"
                    />
                    {loadingWatched ? '...' : (isCurrentlyWatched ? 'Visto' : 'Visto')}
                  </button>
                </div>
              )}
            </div>
            {/* --- FIN DE SECCIÓN DE BOTONES --- */}

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
              <div className="mb-4">
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

            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!trailerKey || isTrailerLoading}
                className="flex items-center justify-center w-full md:w-auto px-6 py-3 font-semibold bg-action-primary text-white rounded-lg shadow-md hover:bg-action-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Ver tráiler"
              >
                <PlayCircle size={20} className="mr-2" />
                {isTrailerLoading ? 'Buscando Tráiler...' : (trailerKey ? 'Ver Tráiler' : 'Tráiler no disponible')}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* --- Cuenta Regresiva (sin cambios) --- */}
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

      {/* --- Sinopsis (sin cambios) --- */}
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mt-8 mb-8">
        <h3 className="text-2xl font-bold text-default mb-4">Sinopsis</h3>
        <p className="text-subtle leading-relaxed text-md">
          {event.description || 'Sinopsis no disponible por el momento.'}
        </p>
      </div>

      {/* --- Relacionados (sin cambios) --- */}
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

      {/* --- Modal del Tráiler (sin cambios) --- */}
      {isModalOpen && trailerKey && (
        <div 
          className="fixed inset-0 bg-gray-t0 bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)} 
        >
          <div 
            className="bg-strong p-2 md:p-4 rounded-lg shadow-2xl w-full max-w-4xl aspect-video relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 bg-white text-default rounded-full p-2 z-10 hover:bg-muted"
              aria-label="Cerrar tráiler"
            >
              <X size={24} />
            </button>
            <iframe
              className="w-full h-full rounded"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPage;