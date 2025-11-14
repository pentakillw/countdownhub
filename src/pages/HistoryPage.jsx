import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import CountdownCard from '../components/CountdownCard.jsx';
import { useWatchedHistory } from '../hooks/useWatchedHistory.js'; 
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { Eye, LogIn } from 'lucide-react'; 

function HistoryPage() {
  const { user } = useAuth();
  const { watchedIds, loadingWatched } = useWatchedHistory();

  const [watchedEvents, setWatchedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadingWatched) {
      return; 
    }
    if (!user || watchedIds.length === 0) {
      setWatchedEvents([]);
      setLoadingEvents(false);
      return;
    }

    const fetchWatchedEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .in('id', watchedIds) 
          .order('release_date', { ascending: false }); 
        if (error) throw error;
        setWatchedEvents(data);
      } catch (err) {
        console.error("Error al cargar eventos vistos:", err);
        setError("No se pudieron cargar tus eventos vistos.");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchWatchedEvents();
  }, [watchedIds, user, loadingWatched]); 

  const isLoading = loadingWatched || loadingEvents;

  return (
    <div>
      {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-default mb-8">
        Mi Historial (Vistos)
      </h1>

      {isLoading && (
        <div className="text-center py-10">
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-lg text-text-subtle">Cargando tu historial...</p>
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
          <h3 className="text-2xl font-bold text-text-default mb-2">Inicia sesión para ver tu historial</h3>
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-lg text-text-subtle mb-6">
            Lleva un registro de las películas y series que ya has visto.
          </p>
          <Link 
            to="/app/login" 
            // --- ¡MODIFICACIÓN! Colores semánticos ---
            className="inline-flex items-center justify-center px-5 py-2 font-medium bg-action-primary text-text-on-accent rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}

      {!isLoading && user && watchedEvents.length === 0 && (
         // --- ¡MODIFICACIÓN! Fondo semántico ---
         <div className="text-center py-20 bg-white dark:bg-bg-muted rounded-lg shadow-md">
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <Eye size={48} className="mx-auto text-text-subtle mb-4" />
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <h3 className="text-2xl font-bold text-text-default mb-2">Tu historial está vacío</h3>
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <p className="text-lg text-text-subtle">
            Marca películas y series como "vistas" (👁️) en la página de detalle.
          </p>
        </div>
      )}

      {!isLoading && user && watchedEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {watchedEvents.map(item => (
            <CountdownCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}

export default HistoryPage;