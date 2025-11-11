import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient.js';
// --- ¡CAMBIO! Importamos desde la ruta correcta ---
import { useAuth } from './useAuth.js'; // <-- Ruta corregida (./ en lugar de ../)

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Efecto de Carga Inicial
  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('event_id')
          .eq('user_id', user.id);
        
        if (error) throw error;
        const ids = data.map(fav => fav.event_id);
        setFavoriteIds(ids);

      } catch (error) {
        console.error("Error al cargar favoritos de Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  // 2. Función para AÑADIR un favorito
  const addFavorite = useCallback(async (eventId) => {
    if (!user) return;

    if (!favoriteIds.includes(eventId)) {
      setFavoriteIds(prevIds => [...prevIds, eventId]);
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          event_id: eventId
        });
      
      if (error) {
        console.warn("Error al añadir favorito (puede ser duplicado):", error.message);
        setFavoriteIds(prevIds => prevIds.filter(id => id !== eventId));
      }
    } catch (error) {
      console.error("Error al añadir favorito:", error);
      setFavoriteIds(prevIds => prevIds.filter(id => id !== eventId));
    }
  }, [user, favoriteIds]);

  // 3. Función para QUITAR un favorito
  const removeFavorite = useCallback(async (eventId) => {
    if (!user) return;

    setFavoriteIds(prevIds => prevIds.filter(id => id !== eventId));

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);
      
      if (error) throw error;

    } catch (error) {
      console.error("Error al quitar favorito:", error);
      setFavoriteIds(prevIds => [...prevIds, eventId]);
    }
  }, [user]);

  // 4. Función de ayuda
  const isFavorite = useCallback((eventId) => {
    return favoriteIds.includes(eventId);
  }, [favoriteIds]);

  // 5. Exponemos las funciones y el estado
  return {
    favorites: favoriteIds,
    addFavorite,
    removeFavorite,
    isFavorite,
    loadingFavorites: loading
  };
}