import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { Calendar, Monitor, Film, PlayCircle, MapPin, Star } from 'lucide-react';
import CountdownCard from '../components/CountdownCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';

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

function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const countdown = useCountdown(event?.release_date);
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();
  
  const eventIdAsNumber = Number(id);
  const isCurrentlyFavorite = isFavorite(eventIdAsNumber);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setEvent(null);
    setRelatedEvents([]);
    setRelatedLoading(true);
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

  if (loading) {
    return <div className="text-center py-20 text-subtle text-lg">Cargando...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-critical mb-4">Error: Evento no encontrado</h2>
        <p className="text-subtle mb-6">{error}</p>
        <Link to="/app" className="text-action-primary font-medium hover:underline">Volver al inicio</Link> {/* <-- ¡RUTA CORREGIDA! */}
      </div>
    );
  }
  if (!event || !countdown) return null;

  const releaseDate = new Date(event.release_date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
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
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-3">
              <span 
                className={`inline-block w-auto px-3 py-1 rounded-full text-sm font-semibold ${
                  event.type === 'tv' ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-action-primary'
                }`}
              >
                {eventInfo.icon} {eventInfo.label}
              </span>

              {user && (
                <button
                  onClick={handleFavoriteClick}
                  disabled={loadingFavorites}
                  className={`flex items-center text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200 disabled:opacity-50 ${
                    isCurrentlyFavorite
                    ? 'bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/40' // Mantenemos amarillo para favorito
                    : 'bg-muted text-subtle hover:bg-subtle'
                  }`}
                  aria-label={isCurrentlyFavorite ? "Quitar de Mi Lista" : "Guardar en Mi Lista"}
                >
                  <Star 
                    size={16} 
                    className="mr-1.5" 
                    fill={isCurrentlyFavorite ? 'currentColor' : 'none'} 
                  />
                  {loadingFavorites ? 'Cargando...' : (isCurrentlyFavorite ? 'Guardado' : 'Guardar')}
                </button>
              )}
            </div>

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
          </div>
        </div>
      </div>

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

      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mt-8 mb-8">
        <h3 className="text-2xl font-bold text-default mb-4">Sinopsis</h3>
        <p className="text-subtle leading-relaxed text-md">
          {event.description || 'Sinopsis no disponible por el momento.'}
        </p>
      </div>

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
  );
}

export default DetailPage;