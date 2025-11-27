// @deno-types="npm:@supabase/functions-js@2.0.0"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

// --- CONFIGURACIÓN MÁXIMA ---
const PAGES_TO_SCAN = 30; 
const FUTURE_DAYS = 1460; 
const LOOKBACK_DAYS = 90;

// --- HELPERS ---
async function getGenreMap(apiKey: string): Promise<Map<number, string>> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=es-MX`);
    if (!res.ok) return new Map();
    const data = await res.json();
    const map = new Map<number, string>();
    data.genres?.forEach((g: any) => map.set(g.id, g.name));
    return map;
  } catch { return new Map(); }
}

async function fetchWatchmodePlatforms(tmdbId: number, apiKey: string) {
  if (!apiKey) return [];
  try {
    const res = await fetch(`https://api.watchmode.com/v1/title/tv-${tmdbId}/sources/?apiKey=${apiKey}&regions=MX`);
    if (!res.ok) return [];
    const data = await res.json();
    const platforms = new Set<string>();
    if (Array.isArray(data)) {
        data.forEach((s: any) => {
            if (s.type === 'sub') {
                let name = s.name;
                if (name.includes('HBO') || name.includes('Max')) name = 'Max';
                if (name.includes('Disney')) name = 'Disney+';
                if (name.includes('Prime')) name = 'Prime Video';
                if (name.includes('Netflix')) name = 'Netflix';
                if (name.includes('Apple')) name = 'Apple TV+';
                platforms.add(name);
            }
        });
    }
    return Array.from(platforms);
  } catch { return []; }
}

async function fetchTmdbProviders(tmdbId: number, apiKey: string) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/watch/providers?api_key=${apiKey}`);
        const data = await res.json();
        const mx = data.results?.MX;
        if (!mx || !mx.flatrate) return [];
        return mx.flatrate.map((p: any) => p.provider_name);
    } catch { return []; }
}

async function fetchTrailer(tmdbId: number, apiKey: string, showName: string, youtubeKey?: string) {
    let trailerUrl = null;
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/videos?api_key=${apiKey}&language=es-MX`);
        const data = await res.json();
        const videos = data.results || [];
        const official = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) 
                      || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

        if (official) {
            trailerUrl = `https://www.youtube.com/watch?v=${official.key}`;
        } else if (youtubeKey) {
            const ytRes = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(showName + " trailer subtitulado oficial")}&key=${youtubeKey}&type=video&maxResults=1`
            );
            const ytData = await ytRes.json();
            if (ytData.items?.[0]) {
                trailerUrl = `https://www.youtube.com/watch?v=${ytData.items[0].id.videoId}`;
            }
        }
    } catch (e) { console.error("Error buscando trailer", e); }
    return trailerUrl;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const TMDB_KEY = Deno.env.get('TMDB_API_KEY');
    const WATCHMODE_KEY = Deno.env.get('WATCHMODE_API_KEY');
    const YOUTUBE_KEY = Deno.env.get('YOUTUBE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!TMDB_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Faltan claves de entorno.");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
    const genreMap = await getGenreMap(TMDB_KEY);
    
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - LOOKBACK_DAYS);
    const pastStr = pastDate.toISOString().split('T')[0];
    
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + FUTURE_DAYS);
    const futureStr = futureDate.toISOString().split('T')[0];

    let allSeriesToProcess = [];

    // --- ESTRATEGIA DUAL ---
    for (let i = 1; i <= 5; i++) {
        const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&language=es-MX&region=MX&sort_by=popularity.desc&air_date.gte=${pastStr}&air_date.lte=${futureStr}&page=${i}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            allSeriesToProcess.push(...data.results);
        }
    }

    for (let i = 1; i <= 25; i++) {
        const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&language=es-MX&sort_by=popularity.desc&page=${i}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            allSeriesToProcess.push(...data.results);
        }
    }

    const uniqueSeries = Array.from(new Map(allSeriesToProcess.map(item => [item.id, item])).values());
    console.log(`Procesando ${uniqueSeries.length} series únicas...`);

    const eventsToUpsert = [];
    const CHUNK_SIZE = 15;

    for (let i = 0; i < uniqueSeries.length; i += CHUNK_SIZE) {
        const chunk = uniqueSeries.slice(i, i + CHUNK_SIZE);
        
        const promises = chunk.map(async (serie: any) => {
            try {
                if (!serie.poster_path && !serie.backdrop_path) return null;

                // ¡MEJORA AQUÍ! Agregamos 'aggregate_credits' para obtener el reparto completo de la serie
                const detailsRes = await fetch(`https://api.themoviedb.org/3/tv/${serie.id}?api_key=${TMDB_KEY}&language=es-MX&append_to_response=aggregate_credits,videos`);
                const details = await detailsRes.json();

                const lastEp = details.last_episode_to_air;
                const nextEp = details.next_episode_to_air;
                
                let finalReleaseDate = null;
                let status = 'Próximamente';

                // --- LÓGICA DE ESTADOS ---
                if (nextEp) {
                    finalReleaseDate = nextEp.air_date;
                    if (lastEp && new Date(lastEp.air_date) >= pastDate) {
                        status = 'Parte 2 en Camino';
                    } else {
                        status = 'Próximamente';
                    }
                } else if (lastEp && new Date(lastEp.air_date) >= pastDate) {
                    finalReleaseDate = lastEp.air_date;
                    status = 'Nuevos Episodios';
                } else if (details.in_production) {
                    if (serie.first_air_date) {
                        const firstAir = new Date(serie.first_air_date);
                        if (firstAir > today) {
                            finalReleaseDate = serie.first_air_date;
                            status = 'En Producción';
                        } else {
                            const provisionalYear = today.getFullYear() + (today.getMonth() > 9 ? 1 : 0);
                            finalReleaseDate = `${provisionalYear}-12-31`;
                            status = 'Temporada Anunciada';
                        }
                    } else {
                        finalReleaseDate = `${today.getFullYear() + 1}-01-01`; 
                        status = 'Muy Pronto';
                    }
                }

                if (!finalReleaseDate && serie.popularity < 20) return null;
                if (!finalReleaseDate) finalReleaseDate = futureStr;
                if (new Date(finalReleaseDate) < pastDate && !['Nuevos Episodios', 'Parte 2 en Camino'].includes(status)) return null;

                // --- EXTRAER REPARTO (CAST) ---
                // Tomamos los top 12 actores
                const cast = details.aggregate_credits?.cast?.slice(0, 12).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    character: c.roles?.[0]?.character || 'Personaje',
                    profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
                })) || [];

                const creator = details.created_by?.length > 0 ? details.created_by[0].name : null;

                // Plataformas
                let platforms = await fetchWatchmodePlatforms(serie.id, WATCHMODE_KEY || '');
                if (platforms.length === 0) {
                    platforms = await fetchTmdbProviders(serie.id, TMDB_KEY);
                }

                let platformStr = "Por Anunciar";
                if (platforms.length > 0) {
                    const priority = ['Netflix', 'Max', 'Disney+', 'Prime Video', 'Apple TV+', 'Paramount+'];
                    const best = priority.find(p => platforms.some(pf => pf.includes(p)));
                    platformStr = best || platforms[0];
                } else if (details.networks && details.networks.length > 0) {
                    platformStr = details.networks[0].name;
                }

                const trailer = await fetchTrailer(serie.id, TMDB_KEY, serie.name, YOUTUBE_KEY);
                const genres = serie.genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean);

                return {
                    source_api_id: `tv-${serie.id}`,
                    title: serie.name,
                    type: 'tv',
                    platform: platformStr,
                    release_date: finalReleaseDate, 
                    status: status,
                    description: serie.overview || 'Sinopsis no disponible.',
                    genres: genres,
                    rating: serie.vote_average ? serie.vote_average.toFixed(1) : null,
                    popularity: serie.popularity,
                    image_url: serie.backdrop_path ? `https://image.tmdb.org/t/p/original${serie.backdrop_path}` : null,
                    poster_image_url: serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : null,
                    trailer_url: trailer,
                    last_api_update: new Date(),
                    slug: serie.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    original_title: serie.original_name,
                    // ¡NUEVOS CAMPOS!
                    cast_detailed: cast,
                    director: creator // Usamos el campo director para guardar al creador en series
                };
            } catch (e) {
                return null;
            }
        });

        const results = await Promise.all(promises);
        eventsToUpsert.push(...results.filter(r => r !== null));
    }

    if (eventsToUpsert.length > 0) {
        const { error } = await supabase.from('events').upsert(eventsToUpsert, { onConflict: 'source_api_id' });
        if (error) throw error;
    }

    return new Response(JSON.stringify({ 
        success: true, 
        message: `Base de datos actualizada con ${eventsToUpsert.length} series (incluye Reparto).`
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});