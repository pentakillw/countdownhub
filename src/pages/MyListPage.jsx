import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import CountdownCard from '../components/CountdownCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { Star, LogIn } from 'lucide-react';

function MyListPage() {
  const { user } = useAuth();
  const { favorites, loadingFavorites } = useFavorites();

  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadingFavorites) {
      return;
    }
    if (!user || favorites.length === 0) {
      setFavoriteEvents([]);
      setLoadingEvents(false);
      return;
    }
    const fetchFavoriteEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .in('id', favorites)
          .order('release_date', { ascending: true });
        if (error) throw error;
        setFavoriteEvents(data);
      } catch (err) {
        console.error("Error al cargar eventos favoritos:", err);
        setError("No se pudieron cargar tus eventos guardados.");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchFavoriteEvents();
  }, [favorites, user, loadingFavorites]);

  const isLoading = loadingFavorites || loadingEvents;

  return (
    <div>
      {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-default mb-8">
        Mi Lista
      </h1>

      {isLoading && (
        <div className="text-center py-10">
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-lg text-text-subtle">Cargando tu lista...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-critical-subtle text-text-critical p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !user && (
        // --- ¡MODIFICACIÓN! Fondo semántico ---
        <div className="text-center py-20 bg-white dark:bg-bg-muted rounded-lg shadow-md">
          <LogIn size={48} className="mx-auto text-action-primary mb-4" />
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <h3 className="text-2xl font-bold text-text-default mb-2">Inicia sesión para ver tu lista</h3>
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-lg text-text-subtle mb-6">
            Guarda tus estrenos favoritos en un solo lugar.
          </p>
          <Link 
            to="/app/login" // Corregido
            // --- ¡MODIFICACIÓN! Colores semánticos ---
            className="inline-flex items-center justify-center px-5 py-2 font-medium bg-action-primary text-text-on-accent rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}

      {!isLoading && user && favoriteEvents.length === 0 && (
         // --- ¡MODIFICACIÓN! Fondo semántico ---
         <div className="text-center py-20 bg-white dark:bg-bg-muted rounded-lg shadow-md">
          <Star size={48} className="mx-auto text-yellow-400 mb-4" /> 
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <h3 className="text-2xl font-bold text-text-default mb-2">Tu lista está vacía</h3>
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-lg text-text-subtle">
            Guarda películas y series haciendo clic en el ícono de estrella (⭐) en la página de detalle.
          </p>
        </div>
      )}

      {!isLoading && user && favoriteEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {favoriteEvents.map(item => (
            <CountdownCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}

export default MyListPage;