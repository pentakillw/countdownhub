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
}

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

    // 2. Preparar la llamada a la API
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const allSeriesToUpsert: any[] = []; // Array para guardar todas las series

    // --- ¡NUEVO! Bucle para traer 3 páginas ---
    const TOTAL_PAGES_TO_FETCH = 3;
    console.log(`Iniciando bucle para ${TOTAL_PAGES_TO_FETCH} páginas...`);
    
    for (let page = 1; page <= TOTAL_PAGES_TO_FETCH; page++) {
      console.log(`Obteniendo página ${page}...`);

      const TMDB_API_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=es-MX&region=MX&sort_by=popularity.desc&first_air_date.gte=${today}&vote_count.gte=10&page=${page}`;

      const response = await fetch(TMDB_API_URL);
      if (!response.ok) {
        throw new Error(`Error en la API de TMDB (Página ${page}): ${response.statusText}`);
      }

      const data = await response.json();
      const series: TmdbSeriesResult[] = data.results;

      // 3. Transformar los datos de TMDB a nuestra tabla 'events'
      const seriesToUpsert = series
        .filter(serie => serie.backdrop_path && serie.first_air_date) // Filtra si no tiene imagen o fecha
        .map(serie => ({
          source_api_id: `tmdb-${serie.id}`, // ID único (importante para upsert)
          title: serie.name, // <-- Las series usan 'name'
          description: serie.overview || 'Sinopsis no disponible por el momento.', // <-- Arreglo
          type: 'tv',
          platform: 'Streaming', // Por defecto para series
          release_date: new Date(serie.first_air_date).toISOString(), // <-- Las series usan 'first_air_date'
          image_url: `${TMDB_IMAGE_BASE_URL}${serie.backdrop_path}`, // <-- Arreglo (backdrop)
          last_api_update: new Date().toISOString(),
        }));

      allSeriesToUpsert.push(...seriesToUpsert);
      console.log(`Página ${page} procesada, ${seriesToUpsert.length} series añadidas a la lista.`);
    }
    
    console.log(`Total de series para guardar: ${allSeriesToUpsert.length}`);

    // 4. Guardar los datos en Supabase usando "upsert"
    const { error: upsertError } = await supabaseClient
      .from('events')
      .upsert(allSeriesToUpsert, {
        onConflict: 'source_api_id',
      });

    if (upsertError) {
      console.error('Error al guardar en Supabase:', upsertError);
      throw upsertError;
    }

    console.log(`¡Éxito! ${allSeriesToUpsert.length} series guardadas/actualizadas.`);

    // 5. Devolver una respuesta exitosa
    return new Response(JSON.stringify({ message: `Éxito. ${allSeriesToUpsert.length} series procesadas.` }), {
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