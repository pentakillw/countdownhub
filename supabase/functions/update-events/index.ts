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
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
}

// Define la estructura de nuestra tabla 'events'
interface Event {
  title: string;
  type: 'movie';
  platform: 'Cine';
  release_date: string;
  image_url: string; // (Backdrop)
  poster_image_url: string; // (Poster)
  description: string;
  source_api_id: string;
  last_api_update: string;
  genres: string[];
}

// --- ¡CAMBIO AQUÍ! ---
const TOTAL_PAGES_TO_FETCH = 50; // Aumentado de 10 a 50

// Función para obtener el mapa de géneros
async function getGenreMap(apiKey: string): Promise<Map<number, string>> {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es-MX`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo obtener el mapa de géneros de películas');
  }
  const data = await response.json();
  const genreMap = new Map<number, string>();
  data.genres.forEach((genre: { id: number; name: string }) => {
    genreMap.set(genre.id, genre.name);
  });
  return genreMap;
}

// --- NUEVAS FUNCIONES DE FECHA ---
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFutureDateString(years: number): string {
  const today = new Date();
  const futureDate = new Date(today.setFullYear(today.getFullYear() + years));
  const year = futureDate.getFullYear();
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const day = futureDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// --- FIN DE NUEVAS FUNCIONES ---

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

    // 3. Obtener el mapa de géneros
    console.log("Obteniendo mapa de géneros de películas...");
    const genreMap = await getGenreMap(TMDB_API_KEY);
    console.log(`Mapa de géneros obtenido con ${genreMap.size} entradas.`);

    // --- ¡NUEVA LÓGICA DE FECHAS! ---
    const todayString = getTodayDateString();
    const futureString = getFutureDateString(5); // 5 Años en el futuro
    console.log(`Buscando películas entre ${todayString} y ${futureString}`);
    // --- FIN LÓGICA DE FECHAS ---

    let allEventsToUpsert: Event[] = [];
    
    console.log(`Iniciando bucle de ${TOTAL_PAGES_TO_FETCH} páginas...`);

    for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
      console.log(`--- Obteniendo Página ${page} de Películas ---`);
      
      // --- ¡ENDPOINT Y PARÁMETROS CAMBIADOS! ---
      // Usamos 'discover/movie' para poder filtrar por rango de fechas
      const TMDB_URL = new URL('https://api.themoviedb.org/3/discover/movie');
      TMDB_URL.searchParams.set('api_key', TMDB_API_KEY);
      TMDB_URL.searchParams.set('language', 'es-MX');
      TMDB_URL.searchParams.set('region', 'MX');
      TMDB_URL.searchParams.set('page', page.toString());
      // --- ¡NUEVOS FILTROS DE FECHA Y ORDEN! ---
      TMDB_URL.searchParams.set('sort_by', 'release_date.asc'); // Más cercanas primero
      TMDB_URL.searchParams.set('release_date.gte', todayString); // Desde hoy
      TMDB_URL.searchParams.set('release_date.lte', futureString); // Hasta 5 años
      // --- FIN DE CAMBIOS DE ENDPOINT ---

      // 4. Llamar a la API de TMDB
      const tmdbResponse = await fetch(TMDB_URL.toString());

      if (!tmdbResponse.ok) {
        console.warn(`Error de TMDB en página ${page}: ${tmdbResponse.statusText}. Saltando esta página.`);
        continue;
      }

      const tmdbData = await tmdbResponse.json();
      const movies: TmdbMovie[] = tmdbData.results;
      console.log(`Página ${page} trajo ${movies.length} películas.`);

      // 5. Transformar y Filtrar los datos
      const eventsFromPage: Event[] = movies
        .map((movie) => {
          const imageUrl = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : null;
          
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null;

          if (!imageUrl || !posterUrl || !movie.release_date) {
            console.log(`Filtrando "${movie.title}" por falta de imágenes o fecha.`);
            return null;
          }

          const description = movie.overview || 'Sinopsis no disponible por el momento.';

          const genres = movie.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => name !== undefined);

          return {
            title: movie.title,
            type: 'movie' as const,
            platform: 'Cine',
            release_date: `${movie.release_date}T12:00:00Z`,
            image_url: imageUrl,
            poster_image_url: posterUrl,
            description: description,
            source_api_id: `movie-${movie.id}`,
            last_api_update: new Date().toISOString(),
            genres: genres,
          };
        })
        .filter((event): event is Event => event !== null); 
        
      allEventsToUpsert.push(...eventsFromPage);
    }

    console.log(`Total de eventos (antes de duplicados): ${allEventsToUpsert.length}`);

    // De-duplicar la lista ANTES de enviarla a Supabase.
    const uniqueEventsMap = new Map();
    allEventsToUpsert.forEach(event => {
      uniqueEventsMap.set(event.source_api_id, event);
    });
    const uniqueEventsToUpsert = Array.from(uniqueEventsMap.values());
    
    console.log(`Total de eventos ÚNICOS para insertar/actualizar: ${uniqueEventsToUpsert.length}`);

    if (uniqueEventsToUpsert.length === 0) {
      console.log("No hay eventos nuevos para insertar.");
      return new Response(
        JSON.stringify({ success: true, message: "No hay eventos nuevos." }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // 6. Insertar/Actualizar (Upsert) en Supabase
    const { error: upsertError } = await supabaseClient
      .from('events')
      .upsert(uniqueEventsToUpsert, {
        onConflict: 'source_api_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error('Error al insertar en Supabase:', upsertError);
      throw upsertError;
    }

    console.log(`¡Éxito! ${uniqueEventsToUpsert.length} películas actualizadas.`);

    // 7. Devolver respuesta de éxito
    return new Response(
      JSON.stringify({ success: true, message: `${uniqueEventsToUpsert.length} películas actualizadas.` }),
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