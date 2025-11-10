import React, { useState, useEffect } from 'react';
// 1. Importamos nuestro componente de tarjeta
import CountdownCard from '/src/components/CountdownCard.jsx';
// 2. Importamos nuestro cliente de Supabase
import { supabase } from '/src/supabaseClient.js';

// Esta es la página de Inicio (HomePage)
function HomePage() {
  // 3. Creamos estados para guardar los items y saber si estamos cargando
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. Usamos useEffect para pedir los datos CUANDO el componente se monta
  useEffect(() => {
    // 5. Creamos una función asíncrona para pedir los datos
    async function getItems() {
      try {
        setLoading(true);
        
        // 6. ¡Esta es la petición a Supabase!
        // Pedimos todos los items de la tabla 'events'
        const { data, error } = await supabase
          .from('events') // <-- El nombre de nuestra tabla
          .select('*');   // <-- Pedimos todas las columnas

        if (error) {
          // Si Supabase nos da un error, lo guardamos
          console.error('Error al cargar datos:', error);
          setError(error.message);
        } else {
          // Si todo sale bien, guardamos los datos en el estado
          setItems(data);
        }
      } catch (err) {
        // Si hay un error de código, lo guardamos
        console.error('Error en la función getItems:', err);
        setError(err.message);
      } finally {
        // Al final (con error o sin él), dejamos de cargar
        setLoading(false);
      }
    }

    // 7. Llamamos a la función que acabamos de crear
    getItems();
  }, []); // El array vacío [] asegura que esto solo se ejecuta 1 vez

  // --- Renderizado del componente ---

  // 8. Mostramos un mensaje de carga
  if (loading) {
    return <p className="text-center text-brand-light text-lg">Cargando próximos estrenos...</p>;
  }

  // 9. Mostramos un mensaje de error si algo salió mal
  if (error) {
    return <p className="text-center text-red-400 text-lg">Error al cargar datos: {error}</p>;
  }

  // 10. Mostramos las tarjetas si todo salió bien
  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-light mb-8">
        Próximos Estrenos
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 11. Hacemos el .map() sobre 'items' (del estado) en lugar de 'mockData' */}
        {items.map((item) => (
          <CountdownCard key={item.id} item={item} />
        ))}
        
      </div>
    </div>
  );
}

export default HomePage;