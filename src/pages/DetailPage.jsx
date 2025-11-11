import React, { useState, useEffect } from 'react';
// ¡Importamos hooks de React Router!
// useParams: para leer el ':id' de la URL
// Link: para crear el botón de "Volver"
import { useParams, Link } from 'react-router-dom';
import { supabase } from '/src/supabaseClient.js';
import { ArrowLeft } from 'lucide-react'; // Un ícono para "Volver"

// --- Componente de Cuenta Regresiva Detallada ---
// (Lo creamos aquí mismo para no complicar con más archivos)
function DetailedCountdown({ targetDate }) {
  
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    } else {
      return null; // Si ya pasó, no mostramos el contador
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Actualiza el contador cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Limpia el intervalo cuando el componente se "desmonta"
    return () => clearInterval(timer);
  }, [targetDate]); // Se recalcula si la fecha objetivo cambia

  if (!timeLeft) {
    return (
      <div className="text-5xl font-black text-brand-accent text-center">
        ¡Ya se estrenó!
      </div>
    );
  }

  // Componente para cada "caja" de tiempo (Día, Hora, etc.)
  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-brand-secondary p-6 rounded-lg shadow-lg min-w-[100px]">
      <span className="text-5xl font-black text-brand-primary">{String(value).padStart(2, '0')}</span>
      <span className="text-sm font-medium text-brand-light opacity-70 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center gap-4 md:gap-8 my-8">
      <TimeBox value={timeLeft.días} label="Días" />
      <TimeBox value={timeLeft.horas} label="Horas" />
      <TimeBox value={timeLeft.minutos} label="Minutos" />
      <TimeBox value={timeLeft.segundos} label="Segundos" />
    </div>
  );
}
// --- Fin del Componente de Cuenta Regresiva ---


// --- Página de Detalle Principal ---
function DetailPage() {
  // 1. Obtenemos el 'id' de la URL
  const { id } = useParams(); 
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Usamos useEffect para cargar los datos del evento
  useEffect(() => {
    async function getEvent() {
      setLoading(true);
      setError(null);

      // Pedimos a Supabase que nos dé 1 solo evento,
      // el que tenga el 'id' que viene de la URL
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*') // Queremos todas las columnas
        .eq('id', id)  // Donde el 'id' sea igual al de la URL
        .single(); // Solo esperamos 1 resultado

      if (fetchError) {
        console.error('Error al cargar el evento:', fetchError);
        setError('No se pudo encontrar el evento.');
      } else {
        setEvent(data);
      }
      setLoading(false);
    }

    getEvent();
  }, [id]); // Este efecto se repite si el 'id' de la URL cambia

  // --- Renderizado ---

  if (loading) {
    return (
      <div className="text-center text-lg text-brand-light">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-400">
        {error}
        <Link to="/" className="flex items-center justify-center mt-6 text-brand-primary hover:text-purple-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!event) {
    return null; // No debería pasar si no hay error, pero es buena práctica
  }

  // Si todo salió bien, mostramos los detalles
  return (
    <div className="max-w-4xl mx-auto">
      {/* Botón de Volver */}
      <Link to="/" className="inline-flex items-center mb-6 text-brand-primary hover:text-purple-300 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver a Próximos Estrenos
      </Link>

      {/* Título Principal */}
      <h1 className="text-5xl font-black text-brand-light mb-4">
        {event.title}
      </h1>
      
      {/* Imagen Panorámica (Backdrop) */}
      <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl mb-8">
        <img 
          src={event.image_url.replace('w500', 'w1280')} // Pedimos imagen de alta resolución
          alt={`Póster de ${event.title}`} 
          className="object-cover h-full w-full"
        />
      </div>
      
      {/* Cuenta Regresiva Detallada */}
      <DetailedCountdown targetDate={event.release_date} />

      {/* Sinopsis / Descripción */}
      <div className="bg-brand-secondary p-8 rounded-lg shadow-lg mt-12">
        <h2 className="text-3xl font-bold text-brand-light mb-4">
          Sinopsis
        </h2>
        <p className="text-lg text-brand-light opacity-80 leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
}

export default DetailPage;