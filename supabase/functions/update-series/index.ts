// @deno-types="npm:@supabase/functions-js@2.0.0"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @deno-types="npm:@supabase/supabase-js@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { corsHeaders } from '../_shared/cors.ts';

// --- NUEVA INTERFAZ DE EVENTO ---
interface Event {
  title: string;
  type: 'tv'; // Tipo TV
  platform: string; // Dinámico
  release_date: string;
  image_url: string;
  poster_image_url: string;
  description: string;
  source_api_id: string;
  last_api_update: string;
  genres: string[];
  trailer_url: string | null; // ¡NUEVO CAMPO!
}

interface TmdbSeries {
  id: number;
  name: string; // Las series usan 'name'
  overview: string | null;
  backdrop_path: string | null;
  poster_path: string | null;
  first_air_date: string; // Las series usan 'first_air_date'
  genre_ids: number[];
}

const TOTAL_PAGES_TO_FETCH = 50;

// --- INICIO DE NUEVAS FUNCIONES DE AYUDA ---

/**
 * Obtiene el mapa de géneros de TV de TMDB.
 */
async function getGenreMap(apiKey: string): Promise<Map<number, string>> {
  const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=es-MX`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo obtener el mapa de géneros de TV');
  const data = await response.json();
  const genreMap = new Map<number, string>();
  data.genres.forEach((genre: { id: number; name: string }) => {
    genreMap.set(genre.id, genre.name);
  });
  return genreMap;
}

/**
 * Busca el mejor tráiler en los resultados de videos de TMDB.
 */
function findBestTmdbTrailer(videos: any[]): string | null {
  if (!videos || videos.length === 0) return null;
  const trailers = videos.filter(v => v.site === 'YouTube' && v.type === 'Trailer');
  const officialTrailer = trailers.find(v => v.official === true);
  return officialTrailer?.key || trailers[0]?.key || null;
}

/**
 * Busca la plataforma de streaming para MX.
 */
function findProvider(providers: any): string {
  if (!providers || !providers.MX) return 'Por Anunciar';

  const mx = providers.MX;

  // 1. Prioridad: Plataformas de Streaming (flatrate)
  if (mx.flatrate && mx.flatrate.length > 0) {
    return mx.flatrate[0].provider_name;
  }
  // 2. Siguiente: Renta o Compra
  if (mx.rent && mx.rent.length > 0) {
    return mx.rent[0].provider_name;
  }
  if (mx.buy && mx.buy.length > 0) {
    return mx.buy[0].provider_name;
  }
  
  // 3. Default
  return 'Por Anunciar';
}

/**
 * Fallback: Busca un tráiler en la API de YouTube si TMDB falla.
 */
async function searchYouTubeTrailer(
  query: string,
  apiKey: string,
): Promise<string | null> {
  console.log(`Fallback de YouTube: Buscando "${query}"`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error en API de YouTube:", await response.text());
      return null;
    }
    const data = await response.json();
    const videoId = data.items?.[0]?.id?.videoId;
    return videoId || null;
  } catch (err) {
    console.error("Error al contactar YouTube:", err);
    return null;
  }
}

// Funciones de fecha (sin cambios)
function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getFutureDateString(years: number): string {
  const today = new Date();
  today.setFullYear(today.getFullYear() + years);
  return today.toISOString().split('T')[0];
}

// --- FIN DE NUEVAS FUNCIONES DE AYUDA ---

serve(async (req: Request): Promise<Response> => {
  // Manejo de la solicitud pre-vuelo (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log(`Iniciando 'update-series' (Series) para ${TOTAL_PAGES_TO_FETCH} páginas...`);

  try {
    // 1. Obtener claves secretas (¡NUEVA CLAVE DE YOUTUBE!)
    const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY'); // ¡NUEVA!
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!TMDB_API_KEY || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Faltan variables de entorno de Supabase o TMDB.");
    }
    if (!YOUTUBE_API_KEY) {
      console.warn("Advertencia: Falta YOUTUBE_API_KEY. El fallback de tráilers no funcionará.");
    }

    // 2. Crear clientes
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);
    const genreMap = await getGenreMap(TMDB_API_KEY);
    
    // 3. Lógica de fechas
    const todayString = getTodayDateString();
    const futureString = getFutureDateString(5);
    console.log(`Buscando series entre ${todayString} y ${futureString}`);

    let allEventsToUpsert: Event[] = [];
    
    // 4. Bucle principal de páginas
    for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
      console.log(`--- Obteniendo Página ${page} de Series ---`);
      
      const TMDB_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=es-MX&region=MX&page=${page}&sort_by=first_air_date.asc&first_air_date.gte=${todayString}&first_air_date.lte=${futureString}`;
      
      const tmdbResponse = await fetch(TMDB_URL);
      if (!tmdbResponse.ok) continue;

      const tmdbData = await tmdbResponse.json();
      const series: TmdbSeries[] = tmdbData.results;
      console.log(`Página ${page} trajo ${series.length} series.`);

      // --- ¡NUEVO! Bucle Concurrente para Detalles ---
      const detailPromises = series.map(async (serie) => {
        try {
          const [videosRes, providersRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/tv/${serie.id}/videos?api_key=${TMDB_API_KEY}&language=es-MX,en-US`),
            fetch(`https://api.themoviedb.org/3/tv/${serie.id}/watch/providers?api_key=${TMDB_API_KEY}`)
          ]);

          if (!videosRes.ok || !providersRes.ok) return null;

          const videosData = await videosRes.json();
          const providersData = await providersRes.json();

          // Lógica de Tráiler
          let trailerKey = findBestTmdbTrailer(videosData.results);
          if (!trailerKey && YOUTUBE_API_KEY) {
            trailerKey = await searchYouTubeTrailer(
              `${serie.name} trailer oficial`,
              YOUTUBE_API_KEY
            );
          }
          const trailerUrl = trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null;

          // Lógica de Plataforma
          const platform = findProvider(providersData.results);
          
          // --- Construir el objeto Evento ---
          const imageUrl = serie.backdrop_path ? `https://image.tmdb.org/t/p/w500${serie.backdrop_path}` : null;
          const posterUrl = serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : null;

          if (!imageUrl || !posterUrl || !serie.first_air_date) return null;

          const genres = serie.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => name !== undefined);

          return {
            title: serie.name, // 'name' para series
            type: 'tv' as const,
            platform: platform, // ¡Dinámico!
            release_date: `${serie.first_air_date}T12:00:00Z`, // 'first_air_date'
            image_url: imageUrl,
            poster_image_url: posterUrl,
            description: serie.overview || 'Sinopsis no disponible por el momento.',
            source_api_id: `tv-${serie.id}`,
            last_api_update: new Date().toISOString(),
            genres: genres,
            trailer_url: trailerUrl, // ¡Nuevo!
          };
        } catch (err) {
          console.error(`Error procesando serie ${serie.id}:`, err);
          return null;
        }
      });

      const eventsFromPage = (await Promise.all(detailPromises))
        .filter((event): event is Event => event !== null);
        
      allEventsToUpsert.push(...eventsFromPage);
    }

    // 5. De-duplicar y Guardar en Supabase
    console.log(`Total (antes de duplicados): ${allEventsToUpsert.length}`);
    const uniqueEventsMap = new Map();
    allEventsToUpsert.forEach(event => {
      uniqueEventsMap.set(event.source_api_id, event);
    });
    const uniqueEventsToUpsert = Array.from(uniqueEventsMap.values());
    
    console.log(`Total ÚNICOS para insertar/actualizar: ${uniqueEventsToUpsert.length}`);

    if (uniqueEventsToUpsert.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No hay eventos nuevos." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }
    
    const { error: upsertError } = await supabaseClient
      .from('events')
      .upsert(uniqueEventsToUpsert, {
        onConflict: 'source_api_id',
        ignoreDuplicates: false,
      });

    if (upsertError) throw upsertError;

    console.log(`¡Éxito! ${uniqueEventsToUpsert.length} series actualizadas.`);
    return new Response(JSON.stringify({ success: true, message: `${uniqueEventsToUpsert.length} series actualizadas.` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error('Error en la función:', error.message, error);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});