// Nota: ¡Asegúrate de tener la extensión de Deno para VS Code!
// Importa las herramientas necesarias
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Constantes de la API de TMDB
const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Define la estructura de los datos que esperamos de TMDB
interface TmdbSeriesResult {
  id: number;
  name: string; // Las series usan "name" en lugar de "title"
  overview: string;
  first_air_date: string; // Las series usan "first_air_date"
  backdrop_path: string | null;
  poster_path: string | null;
  genre_ids: number[];
}

// Función para obtener el mapa de géneros de TV
async function getGenreMap(apiKey: string): Promise<Map<number, string>> {
  const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=es-MX`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo obtener el mapa de géneros de TV');
  }
  const data = await response.json();
  const genreMap = new Map<number, string>();
  data.genres.forEach((genre: { id: number; name: string }) => {
    genreMap.set(genre.id, genre.name);
  });
  return genreMap;
}

// --- FUNCIONES DE FECHA ---
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ¡NUEVA FUNCIÓN AÑADIDA!
function getFutureDateString(years: number): string {
  const today = new Date();
  const futureDate = new Date(today.setFullYear(today.getFullYear() + years));
  const year = futureDate.getFullYear();
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const day = futureDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// --- FIN DE FUNCIONES DE FECHA ---

serve(async (_req) => {
  // Manejo de la solicitud pre-vuelo (CORS)
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Iniciando la función 'update-series' (Series)...");

    // Verifica que la clave de TMDB esté configurada
    if (!TMDB_API_KEY) {
      throw new Error('Falta la variable TMDB_API_KEY');
    }

    // 1. Crear el cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } } }
    );

    // Obtener mapa de géneros
    console.log("Obteniendo mapa de géneros de TV...");
    const genreMap = await getGenreMap(TMDB_API_KEY);
    console.log(`Mapa de géneros obtenido con ${genreMap.size} entradas.`);

    // 2. Preparar la llamada a la API
    const allSeriesToUpsert: any[] = [];

    // --- ¡NUEVA LÓGICA DE FECHAS! ---
    const todayString = getTodayDateString();
    const futureString = getFutureDateString(5); // 5 Años en el futuro
    console.log(`Buscando series entre ${todayString} y ${futureString}`);
    // --- FIN LÓGICA DE FECHAS ---

    // Bucle para traer 50 páginas (¡CAMBIO AQUÍ!)
    const TOTAL_PAGES_TO_FETCH = 50; // Aumentado de 10 a 50
    console.log(`Iniciando bucle para ${TOTAL_PAGES_TO_FETCH} páginas...`);
    
    for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
      console.log(`Obteniendo página ${page}...`);

      // --- ¡LÓGICA DE URL ACTUALIZADA! ---
      // Añadimos 'first_air_date.lte' para limitar la búsqueda a 5 años
      const TMDB_API_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=es-MX&region=MX&sort_by=first_air_date.asc&page=${page}&first_air_date.gte=${todayString}&first_air_date.lte=${futureString}`;

      const response = await fetch(TMDB_API_URL);
      if (!response.ok) {
        console.warn(`Error en la API de TMDB (Página ${page}): ${response.statusText}. Saltando página.`);
        continue;
      }

      const data = await response.json();
      const series: TmdbSeriesResult[] = data.results;

      // 3. Transformar los datos de TMDB a nuestra tabla 'events'
      const seriesToUpsert = series
        .filter(serie => serie.backdrop_path && serie.poster_path && serie.first_air_date) // Filtra si no tiene ambas imágenes o fecha
        .map(serie => {
          const posterUrl = `${TMDB_IMAGE_BASE_URL}${serie.poster_path}`;
          const backdropUrl = `${TMDB_IMAGE_BASE_URL}${serie.backdrop_path}`;

          // Mapear los IDs de género a nombres
          const genres = serie.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => name !== undefined);

          return {
            source_api_id: `tv-${serie.id}`,
            title: serie.name, 
            description: serie.overview || 'Sinopsis no disponible por el momento.',
            type: 'tv',
            platform: 'Streaming',
            release_date: `${serie.first_air_date}T12:00:00Z`,
            image_url: backdropUrl,
            poster_image_url: posterUrl,
            last_api_update: new Date().toISOString(),
            genres: genres,
          };
        });

      allSeriesToUpsert.push(...seriesToUpsert);
      console.log(`Página ${page} procesada, ${seriesToUpsert.length} series añadidas a la lista.`);
    }
    
    console.log(`Total de series (antes de duplicados): ${allSeriesToUpsert.length}`);

    // De-duplicar la lista
    const uniqueSeriesMap = new Map();
    allSeriesToUpsert.forEach(serie => {
      uniqueSeriesMap.set(serie.source_api_id, serie);
    });
    const uniqueSeriesToUpsert = Array.from(uniqueSeriesMap.values());

    console.log(`Total de series ÚNICAS para guardar: ${uniqueSeriesToUpsert.length}`);

    if (uniqueSeriesToUpsert.length === 0) {
      console.log("No hay series nuevas para insertar.");
      return new Response(
        JSON.stringify({ success: true, message: "No hay series nuevas." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 4. Guardar los datos en Supabase usando "upsert"
    const { error: upsertError } = await supabaseClient
      .from('events')
      .upsert(uniqueSeriesToUpsert, {
        onConflict: 'source_api_id',
      });

    if (upsertError) {
      console.error('Error al guardar en Supabase:', upsertError);
      throw upsertError;
    }

    console.log(`¡Éxito! ${uniqueSeriesToUpsert.length} series guardadas/actualizadas.`);

    // 5. Devolver una respuesta exitosa
    return new Response(JSON.stringify({ message: `Éxito. ${uniqueSeriesToUpsert.length} series procesadas.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Manejo de errores
    console.error('Error en la función (Series):', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});