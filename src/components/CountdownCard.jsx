import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para hacer la tarjeta cliqueable

// Este componente es una sola tarjeta de cuenta regresiva
function CountdownCard({ item }) {
  const { id, title, type, release_date, platform, image_url } = item;

  // --- Lógica de la Cuenta Regresiva (simplificada) ---
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const releaseDate = new Date(release_date);
      
      // Ajuste para comparar solo fechas (ignorando la hora)
      today.setHours(0, 0, 0, 0);
      releaseDate.setHours(0, 0, 0, 0);

      const diffTime = releaseDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysLeft(diffDays);
    };

    calculateDays();
    // Actualiza el cálculo una vez al día (o si el item cambia)
    const interval = setInterval(calculateDays, 1000 * 60 * 60 * 24); 
    return () => clearInterval(interval);
  }, [release_date]);

  // Formateo del tipo de evento
  const formatType = (type) => {
    if (type === 'movie') return 'Película';
    if (type === 'tv') return 'Serie';
    if (type === 'game') return 'Videojuego';
    if (type === 'sport') return 'Deporte';
    return type;
  };

  // Renderizado condicional
  if (daysLeft === null || daysLeft < 0) {
    // No renderizamos nada si la fecha ya pasó (la HomePage ya filtra esto,
    // pero es una doble seguridad)
    return null; 
  }

  // Define el color del borde y el texto de la cuenta regresiva
  let accentColorClass = 'text-brand-blue'; // Azul por defecto
  if (type === 'tv') {
    accentColorClass = 'text-brand-green'; // Verde para series
  }

  return (
    // Toda la tarjeta es un enlace a la página de detalle
    <Link 
      to={`/event/${id}`} 
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group"
    >
      
      {/* Contenedor de la Imagen */}
      <div className="h-48 w-full overflow-hidden bg-brand-text">
        <img 
          src={image_url} 
          alt={`Póster de ${title}`}
          // 'object-cover' rellena la caja, 'w-full' y 'h-full'
          // 'transition-transform duration-500 group-hover:scale-110' = Efecto de zoom
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          // Fallback por si la imagen no carga
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x281/322D30/F9FBFC?text=ClicTimes"; }}
        />
      </div>

      {/* Contenedor del Contenido (con padding) */}
      {/* 'flex-grow' hace que este div ocupe el espacio, empujando el footer de la tarjeta hacia abajo */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Tipo y Plataforma */}
        <div className="flex justify-between items-center mb-2 text-sm font-medium">
          {/* Usamos el color de acento (verde o azul) para el tipo */}
          <span className={`font-bold ${accentColorClass}`}>
            {formatType(type)}
          </span>
          <span className="text-brand-gray">{platform}</span>
        </div>

        {/* Título (Oscuro) */}
        <h3 className="text-lg font-bold text-brand-text mb-3">
          {title}
        </h3>

        {/* Spacer - empuja el contenido de abajo hacia el fondo */}
        <div className="flex-grow" />

        {/* Footer de la Tarjeta (Fecha y Cuenta Regresiva) */}
        {/* 'mt-auto' asegura que se pegue al fondo si el spacer no es suficiente */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-brand-white/10">
          
          {/* Fecha de Estreno (Gris) */}
          <div className="text-brand-gray">
            <span className="text-xs block">Estreno:</span>
            <span className="text-sm font-medium">
              {new Date(release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          {/* Cuenta Regresiva (Color de acento) */}
          <div className="text-right">
            <span className={`text-4xl font-black ${accentColorClass}`}>
              {daysLeft === 0 ? 'Hoy' : daysLeft}
            </span>
            <span className={`text-lg text-brand-text opacity-80 ml-1 ${daysLeft === 0 ? 'hidden' : 'inline'}`}>
              {daysLeft === 1 ? 'Día' : 'Días'}
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default CountdownCard;