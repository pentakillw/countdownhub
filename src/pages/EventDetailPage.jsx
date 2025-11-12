import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { Calendar, Film, Tv, Globe, Star, Eye, Share2, Heart, Play } from 'lucide-react'; // Importamos Heart
import { useAuth } from '../hooks/useAuth.js';
import YouTube from 'react-youtube';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddedToMyList, setIsAddedToMyList] = useState(false);
  const [isInHistory, setIsInHistory] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // Nuevo estado para "Me gusta"
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setEvent(data);
      } catch (err) {
        console.error("Error al cargar detalles del evento:", err);
        setError("No se pudieron cargar los detalles del evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && event) {
        // Check My List status
        const { data: myListData, error: myListError } = await supabase
          .from('user_my_list')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .single();
        if (myListError && myListError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error("Error fetching my list status:", myListError);
        }
        setIsAddedToMyList(!!myListData);

        // Check History status
        const { data: historyData, error: historyError } = await supabase
          .from('user_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .single();
        if (historyError && historyError.code !== 'PGRST116') {
          console.error("Error fetching history status:", historyError);
        }
        setIsInHistory(!!historyData);

        // Check Like status
        const { data: likedData, error: likedError } = await supabase
          .from('user_likes') // Suponiendo una tabla 'user_likes'
          .select('*')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .single();
        if (likedError && likedError.code !== 'PGRST116') {
          console.error("Error fetching like status:", likedError);
        }
        setIsLiked(!!likedData);
      }
    };
    fetchUserData();
  }, [user, event]);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!event || !event.tmdb_id || !event.type) return;

      const typePath = event.type === 'movie' ? 'movie' : 'tv';
      const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${typePath}/${event.tmdb_id}/videos?api_key=${TMDB_API_KEY}&language=es-MX`
        );
        const data = await response.json();
        
        const trailer = data.results.find(
          (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        console.error("Error fetching trailer:", err);
        setTrailerKey(null);
      }
    };
    fetchTrailer();
  }, [event]);

  const handleToggleMyList = async () => {
    if (!user) {
      alert("Debes iniciar sesión para añadir a tu lista.");
      navigate('/app/login');
      return;
    }
    try {
      if (isAddedToMyList) {
        await supabase
          .from('user_my_list')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);
        setIsAddedToMyList(false);
      } else {
        await supabase
          .from('user_my_list')
          .insert({ user_id: user.id, event_id: event.id });
        setIsAddedToMyList(true);
      }
    } catch (err) {
      console.error("Error al actualizar mi lista:", err);
      alert("Hubo un error al actualizar tu lista. Intenta de nuevo.");
    }
  };

  const handleToggleHistory = async () => {
    if (!user) {
      alert("Debes iniciar sesión para añadir a tu historial.");
      navigate('/app/login');
      return;
    }
    try {
      if (isInHistory) {
        await supabase
          .from('user_history')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);
        setIsInHistory(false);
      } else {
        await supabase
          .from('user_history')
          .insert({ user_id: user.id, event_id: event.id });
        setIsInHistory(true);
      }
    } catch (err) {
      console.error("Error al actualizar historial:", err);
      alert("Hubo un error al actualizar tu historial. Intenta de nuevo.");
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      alert("Debes iniciar sesión para dar 'Me gusta'.");
      navigate('/app/login');
      return;
    }
    try {
      if (isLiked) {
        await supabase
          .from('user_likes') // Asegúrate de que esta tabla exista y tenga user_id, event_id
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);
        setIsLiked(false);
      } else {
        await supabase
          .from('user_likes')
          .insert({ user_id: user.id, event_id: event.id });
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Error al actualizar 'Me gusta':", err);
      alert("Hubo un error al actualizar tu estado de 'Me gusta'. Intenta de nuevo.");
    }
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `¡Mira el próximo estreno de ${event.title} en ClicTimes!`,
        url: window.location.href,
      })
      .then(() => console.log('Contenido compartido con éxito'))
      .catch((error) => console.error('Error al compartir:', error));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Enlace copiado al portapapeles.");
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-default">Cargando detalles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-critical-subtle text-text-critical p-4 rounded-lg">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button onClick={() => navigate('/app')} className="mt-4 text-action-primary hover:underline">Volver a la página principal</button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10 bg-warning-subtle text-text-warning p-4 rounded-lg">
        <p className="font-bold">Evento no encontrado</p>
        <p>Parece que el evento que buscas no existe o fue eliminado.</p>
        <button onClick={() => navigate('/app')} className="mt-4 text-action-primary hover:underline">Volver a la página principal</button>
      </div>
    );
  }

  const releaseDate = new Date(event.release_date);
  const formattedReleaseDate = releaseDate.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-action-primary hover:text-action-primary-hover transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Volver
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex mb-8">
        <div className="md:w-1/3 h-96 md:h-auto overflow-hidden bg-strong">
          <img 
            src={event.image_url} 
            alt={`Póster de ${event.title}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x750/0C0D0F/E6E7EB?text=ClicTimes"; }}
          />
        </div>
        
        <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-sm font-semibold text-brand-t500 uppercase tracking-wide">
              {event.type === 'movie' ? 'Película' : 'Serie'}
            </span>
            <h1 className="text-4xl font-extrabold text-default mt-2 mb-4">
              {event.title}
            </h1>
            
            <p className="text-default text-lg mb-6 leading-relaxed">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-subtle">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-action-primary" />
                <span>Estreno MX: <span className="font-medium text-default">{formattedReleaseDate}</span></span>
              </div>
              <div className="flex items-center">
                {event.type === 'movie' ? (
                  <Film size={20} className="mr-2 text-action-primary" />
                ) : (
                  <Tv size={20} className="mr-2 text-deco-verde-1" />
                )}
                <span>Plataforma: <span className="font-medium text-default">{event.platform}</span></span>
              </div>
              {event.genres && event.genres.length > 0 && (
                <div className="flex items-center col-span-full">
                  <Globe size={20} className="mr-2 text-action-primary" />
                  <span>Géneros: <span className="font-medium text-default">{event.genres.join(', ')}</span></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {trailerKey && (
              <button 
                onClick={() => setShowTrailer(true)} 
                className="flex items-center px-6 py-3 bg-action-primary text-white rounded-full font-semibold shadow-md hover:bg-action-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-opacity-75"
              >
                <Play size={20} className="mr-2" />
                Buscar Tráiler
              </button>
            )}

            {/* --- CORRECCIÓN 5: Botones de estado con colores mejorados --- */}
            <button
              onClick={handleToggleMyList}
              className={`flex items-center px-4 py-3 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 ${
                isAddedToMyList
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 focus:ring-rose-300' // Rosa claro para "Mi Lista"
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
              }`}
            >
              <Star size={20} className="mr-2" />
              Mi Lista
            </button>

            <button
              onClick={handleToggleHistory}
              className={`flex items-center px-4 py-3 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 ${
                isInHistory
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-300' // Amarillo claro para "Historial"
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
              }`}
            >
              <Eye size={20} className="mr-2" />
              Historial
            </button>

            <button
              onClick={handleToggleLike}
              className={`flex items-center px-4 py-3 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 ${
                isLiked
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-300' // Rojo claro para "Me gusta"
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
              }`}
            >
              <Heart size={20} className="mr-2" />
              Me gusta
            </button>

            <button 
              onClick={shareEvent} 
              className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <Share2 size={20} className="mr-2" />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button 
              onClick={() => setShowTrailer(false)} 
              className="absolute -top-4 -right-4 bg-white text-default rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Cerrar tráiler"
            >
              <X size={24} />
            </button>
            <YouTube videoId={trailerKey} opts={opts} />
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;