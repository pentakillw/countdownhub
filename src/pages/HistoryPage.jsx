import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import CountdownCard from '../components/CountdownCard.jsx';
// --- ¡CAMBIOS AQUÍ! ---
import { useWatchedHistory } from '../hooks/useWatchedHistory.js'; 
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { Eye, LogIn } from 'lucide-react'; // <-- Icono cambiado

function HistoryPage() {
  const { user } = useAuth();
  // --- ¡CAMBIOS AQUÍ! ---
  const { watchedIds, loadingWatched } = useWatchedHistory();

  const [watchedEvents, setWatchedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadingWatched) {
      return; // Espera a que el hook cargue los IDs
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
          .in('id', watchedIds) // <-- Usa los IDs del nuevo hook
          .order('release_date', { ascending: false }); // <-- Los más recientes primero
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
  }, [watchedIds, user, loadingWatched]); // Depende de los IDs del hook

  const isLoading = loadingWatched || loadingEvents;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-default mb-8">
        Mi Historial (Vistos)
      </h1>

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-lg text-subtle">Cargando tu historial...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-critical-subtle text-text-critical p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !user && (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <LogIn size={48} className="mx-auto text-action-primary mb-4" />
          <h3 className="text-2xl font-bold text-default mb-2">Inicia sesión para ver tu historial</h3>
          <p className="text-lg text-subtle mb-6">
            Lleva un registro de las películas y series que ya has visto.
          </p>
          <Link 
            to="/app/login" // Corregido (antes era "/login")
            className="inline-flex items-center justify-center px-5 py-2 font-medium bg-action-primary text-white rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}

      {/* --- ¡TEXTOS CAMBIADOS AQUÍ! --- */}
      {!isLoading && user && watchedEvents.length === 0 && (
         <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <Eye size={48} className="mx-auto text-subtle mb-4" />
          <h3 className="text-2xl font-bold text-default mb-2">Tu historial está vacío</h3>
          <p className="text-lg text-subtle">
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