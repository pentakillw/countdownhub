import React, { useState, useEffect } from 'react';
// ¡CORRECCIÓN! Usamos rutas absolutas desde /src/ para evitar errores.
import { supabase } from '/src/supabaseClient.js';
import CountdownCard from '/src/components/CountdownCard.jsx';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getEvents() {
      setLoading(true);
      setError(null);
      
      // 1. Obtenemos la fecha de "hoy"
      const today = new Date().toISOString();

      // 2. Pedimos a Supabase TODOS los eventos futuros
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .gte('release_date', today) // Filtra los que ya pasaron
        .order('release_date', { ascending: true }); // Ordena por fecha
        // ¡YA NO ESTÁ EL .limit(30)!

      if (fetchError) {
        console.error('Error al cargar los eventos:', fetchError);
        setError('No se pudieron cargar los estrenos. Intenta más tarde.');
      } else {
        setEvents(data);
      }
      setLoading(false);
    }

    getEvents();
  }, []);

  // --- Renderizado ---

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-brand-light mb-8">
          Próximos Estrenos
        </h1>
        <p className="text-lg text-brand-light">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-brand-light mb-8">
          Próximos Estrenos
        </h1>
        <p className="text-lg text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-light mb-8">
        Próximos Estrenos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event) => (
            <CountdownCard key={event.id} item={event} />
          ))
        ) : (
          <p className="text-lg text-brand-light col-span-full">
            No hay próximos estrenos programados. ¡Vuelve pronto!
          </p>
        )}
      </div>
    </div>
  );
}

export default HomePage;