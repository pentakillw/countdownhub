import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Clock, Calendar, Monitor, Film } from 'lucide-react';

// --- Hook de Cuenta Regresiva Detallada ---
// (Separamos la lógica del componente)
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

    // Calcula de inmediato
    calculateTimeLeft();
    // Y luego actualiza cada segundo
    const interval = setInterval(calculateTimeLeft, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// --- Componente de la Página de Detalle ---
function DetailPage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usa el hook de cuenta regresiva
  const countdown = useCountdown(event?.release_date);

  useEffect(() => {
    // Carga los datos del evento desde Supabase
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id) // Pide solo el evento con este ID
          .single(); // Espera un solo resultado

        if (error) throw error;
        if (!data) throw new Error('Evento no encontrado');
        
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]); // Se vuelve a ejecutar si el 'id' de la URL cambia

  // --- Icono y Tipo ---
  const getEventDetails = (type) => {
    switch (type) {
      case 'movie': return { icon: <Film className="inline-block" />, label: 'Película' };
      case 'tv': return { icon: <Monitor className="inline-block" />, label: 'Serie' };
      default: return { icon: <Calendar className="inline-block" />, label: 'Evento' };
    }
  };

  const eventInfo = event ? getEventDetails(event.type) : {};

  // --- Renderizado ---

  if (loading) {
    return <div className="text-center py-20 text-brand-gray text-lg">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error: Evento no encontrado</h2>
        <p className="text-brand-gray mb-6">{error}</p>
        <Link to="/" className="text-brand-blue font-medium hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!event || !countdown) return null; // Seguridad extra

  return (
    <div className="max-w-4xl mx-auto">
      {/* --- Contenedor de la Imagen Panorámica --- */}
      <div className="w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg bg-brand-text mb-8">
        <img
          src={event.image_url}
          alt={`Póster de ${event.title}`}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1000x400/322D30/F9FBFC?text=ClicTimes"; }}
        />
      </div>

      {/* --- Título y Tipo --- */}
      <div className="text-center mb-6">
        <span 
          className={`font-semibold ${event.type === 'tv' ? 'text-brand-green' : 'text-brand-blue'}`}
        >
          {eventInfo.icon} {eventInfo.label}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text mt-2 mb-3">
          {event.title}
        </h1>
        <p className="text-lg text-brand-gray font-medium">
          Estreno: {new Date(event.release_date).toLocaleDateString('es-ES', { dateStyle: 'full' })}
        </p>
      </div>

      {/* --- Cuenta Regresiva Detallada --- */}
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mb-8">
        {countdown.isPast ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-green">¡Ya se estrenó!</h2>
          </div>
        ) : (
          <div className="flex justify-center text-center space-x-4 md:space-x-10">
            <div className="w-20">
              <span className="text-4xl md:text-5xl font-extrabold text-brand-blue block">{countdown.days}</span>
              <span className="text-sm text-brand-gray">Días</span>
            </div>
            <div className="w-20">
              <span className="text-4xl md:text-5xl font-extrabold text-brand-blue block">{countdown.hours}</span>
              <span className="text-sm text-brand-gray">Horas</span>
            </div>
            <div className="w-20">
              <span className="text-4xl md:text-5xl font-extrabold text-brand-blue block">{countdown.minutes}</span>
              <span className="text-sm text-brand-gray">Minutos</span>
            </div>
            <div className="w-20">
              <span className="text-4xl md:text-5xl font-extrabold text-brand-text opacity-70 block">{countdown.seconds}</span>
              <span className="text-sm text-brand-gray">Segundos</span>
            </div>
          </div>
        )}
      </div>

      {/* --- Sinopsis y Detalles --- */}
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h3 className="text-2xl font-bold text-brand-text mb-4">Sinopsis</h3>
        <p className="text-brand-gray leading-relaxed">
          {event.description || 'Sinopsis no disponible por el momento.'}
        </p>
        
        <div className="mt-6 pt-6 border-t border-brand-white/10">
          <h4 className="text-lg font-semibold text-brand-text mb-3">Detalles</h4>
          <span className="inline-block bg-brand-gray bg-opacity-10 text-brand-gray text-sm font-medium px-3 py-1 rounded-full">
            Plataforma: {event.platform}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;