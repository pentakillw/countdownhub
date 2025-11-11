import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient.js';
import { useAuth } from './useAuth.js';

export function useWatchedHistory() {
  const { user } = useAuth();
  const [watchedIds, setWatchedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Efecto de Carga Inicial
  useEffect(() => {
    if (!user) {
      setWatchedIds([]);
      setLoading(false);
      return;
    }

    const fetchWatched = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_watched_history') // <-- Tabla nueva
          .select('event_id')
          .eq('user_id', user.id);
        
        if (error) throw error;
        const ids = data.map(item => item.event_id);
        setWatchedIds(ids);

      } catch (error) {
        console.error("Error al cargar historial de vistos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatched();
  }, [user]);

  // 2. Función para AÑADIR un "visto"
  const addWatched = useCallback(async (eventId) => {
    if (!user) return;

    if (!watchedIds.includes(eventId)) {
      setWatchedIds(prevIds => [...prevIds, eventId]);
    }

    try {
      const { error } = await supabase
        .from('user_watched_history') // <-- Tabla nueva
        .insert({
          user_id: user.id,
          event_id: eventId
        });
      
      if (error) {
        console.warn("Error al añadir a vistos (puede ser duplicado):", error.message);
        setWatchedIds(prevIds => prevIds.filter(id => id !== eventId));
      }
    } catch (error) { // <-- ¡LLAVES { } CORREGIDAS AQUÍ!
      console.error("Error al añadir a vistos:", error);
      setWatchedIds(prevIds => prevIds.filter(id => id !== eventId));
    }
  }, [user, watchedIds]);

  // 3. Función para QUITAR un "visto"
  const removeWatched = useCallback(async (eventId) => {
    if (!user) return;

    setWatchedIds(prevIds => prevIds.filter(id => id !== eventId));

    try {
      const { error } = await supabase
        .from('user_watched_history') // <-- Tabla nueva
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);
      
      if (error) throw error;

    } catch (error) {
      console.error("Error al quitar de vistos:", error);
      // Si falla, volvemos a añadirlo al estado local
      setWatchedIds(prevIds => [...prevIds, eventId]);
    }
  }, [user]);

  // 4. Función de ayuda
  const isWatched = useCallback((eventId) => {
    return watchedIds.includes(eventId);
  }, [watchedIds]);

  // 5. Exponemos las funciones y el estado
  return {
    watchedIds,
    addWatched,
    removeWatched,
    isWatched,
    loadingWatched: loading
  };
}