// @deno-types="npm:@supabase/functions-js@2.0.0"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @deno-types="npm:@supabase/supabase-js@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

// Define la estructura de los datos que esperamos de TMDB
interface TmdbMovie {
  id: number;
  title: string;
  overview: string | null;
  backdrop_path: string | null; 
  release_date: string;
}

// Define la estructura de nuestra tabla 'events'
interface Event {
  title: string;
  type: 'movie';
  platform: 'Cine';
  release_date: string;
  image_url: string;
  description: string;
  source_api_id: string;
  last_api_update: string;
}

// --- ¡NUEVA CONSTANTE! ---
// Define cuántas páginas de TMDB queremos traer
const TOTAL_PAGES_TO_FETCH = 3; // 3 páginas * 20 resultados/página = ~60 películas

serve(async (req: Request): Promise<Response> => {
  console.log(`Iniciando la función 'update-events' (Películas) para ${TOTAL_PAGES_TO_FETCH} páginas...`);

  try {
    // 1. Obtener claves secretas
    const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
    if (!TMDB_API_KEY) {
      throw new Error('Falta la variable TMDB_API_KEY');
    }

    // 2. Crear el cliente de Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Faltan variables de entorno de Supabase.");
    }
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // 3. Configurar la llamada a la API de TMDB
    const today = new Date().toISOString().split('T')[0];
    
    // Este array guardará los resultados de TODAS las páginas
    let allEventsToUpsert: Event[] = [];
    
    console.log(`Iniciando bucle de ${TOTAL_PAGES_TO_FETCH} páginas...`);

    // --- ¡NUEVO BUCLE FOR! ---
    for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
      console.log(`--- Obteniendo Página ${page} de Películas ---`);
      
      const TMDB_URL = new URL('https://api.themoviedb.org/3/discover/movie');
      TMDB_URL.searchParams.set('api_key', TMDB_API_KEY);
      TMDB_URL.searchParams.set('language', 'es-MX');
      TMDB_URL.searchParams.set('region', 'MX');
      TMDB_URL.searchParams.set('sort_by', 'popularity.desc');
      TMDB_URL.searchParams.set('include_adult', 'false');
      TMDB_URL.searchParams.set('primary_release_date.gte', today);
      TMDB_URL.searchParams.set('with_release_type', '3');
      TMDB_URL.searchParams.set('page', page.toString()); // <-- ¡Página dinámica!

      // 4. Llamar a la API de TMDB (para esta página)
      const tmdbResponse = await fetch(TMDB_URL.toString());

      if (!tmdbResponse.ok) {
        console.warn(`Error de TMDB en página ${page}: ${tmdbResponse.statusText}. Saltando esta página.`);
        continue; // Si falla una página, seguimos con la siguiente
      }

      const tmdbData = await tmdbResponse.json();
      const movies: TmdbMovie[] = tmdbData.results;
      console.log(`Página ${page} trajo ${movies.length} películas.`);

      // 5. Transformar y Filtrar los datos (de esta página)
      const eventsFromPage: Event[] = movies
        .map((movie) => {
          const imageUrl = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : null;

          // Filtramos si falta imagen o fecha
          if (!imageUrl || !movie.release_date) {
            console.log(`Filtrando "${movie.title}" por falta de imagen o fecha.`);
            return null;
          }

          // Si la descripción está vacía, ponemos un texto por defecto
          const description = movie.overview || 'Sinopsis no disponible por el momento.';

          return {
            title: movie.title,
            type: 'movie' as const,
            platform: 'Cine',
            release_date: `${movie.release_date}T12:00:00Z`, 
            image_url: imageUrl,
            description: description,
            source_api_id: `movie-${movie.id}`,
            last_api_update: new Date().toISOString(),
          };
        })
        .filter((event): event is Event => event !== null); 
        
      // Añadimos los resultados de esta página al array TOTAL
      allEventsToUpsert.push(...eventsFromPage);
    }
    // --- FIN DEL BUCLE ---

    console.log(`Total de ${allEventsToUpsert.length} eventos para insertar/actualizar.`);

    // 6. Insertar/Actualizar (Upsert) en Supabase (UNA SOLA VEZ AL FINAL)
    if (allEventsToUpsert.length === 0) {
      console.log("No hay eventos nuevos para insertar.");
      return new Response(
        JSON.stringify({ success: true, message: "No hay eventos nuevos." }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    const { error: upsertError } = await supabaseClient
      .from('events')
      .upsert(allEventsToUpsert, {
        onConflict: 'source_api_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error('Error al insertar en Supabase:', upsertError);
      throw upsertError;
    }

    console.log(`¡Éxito! ${allEventsToUpsert.length} películas actualizadas.`);

    // 7. Devolver respuesta de éxito
    return new Response(
      JSON.stringify({ success: true, message: `${allEventsToUpsert.length} películas actualizadas.` }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error en la función:', error.message, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});