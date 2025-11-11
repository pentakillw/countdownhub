import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CountdownCard from '../components/CountdownCard';

// Esta es la página de Inicio
function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      // Obtenemos la fecha de hoy (al inicio del día)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      try {
        // Pedimos a Supabase solo los eventos futuros o de hoy
        // y los ordenamos por fecha de estreno
        const { data, error } = await supabase
          .from('events')
          .select('*')
          // Filtra solo los que se estrenan hoy o en el futuro
          .gte('release_date', todayISO) 
          // Ordena por fecha más próxima primero
          .order('release_date', { ascending: true });

        if (error) {
          throw error;
        }
        
        setEvents(data);

      } catch (err) {
        console.error("Error al cargar eventos:", err);
        setError("No se pudieron cargar los próximos estrenos. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Se ejecuta solo una vez al cargar la página

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-8">
        Próximos Estrenos
      </h1>

      {/* Mensaje de Carga */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-lg text-brand-gray">Cargando estrenos...</p>
          {/* Aquí podríamos poner un Spinner */}
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="text-center py-10 bg-red-100 text-red-700 p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Grid de Tarjetas */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map(item => (
            <CountdownCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Mensaje si no hay eventos */}
      {!loading && !error && events.length === 0 && (
         <div className="text-center py-10">
          <p className="text-lg text-brand-gray">No hay próximos estrenos programados por el momento.</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;