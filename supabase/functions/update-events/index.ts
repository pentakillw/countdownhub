// @deno-types="npm:@supabase/functions-js@2.0.0"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

// --- CONFIGURACIÓN ---
const PAGES_PER_RUN = 30; 
const MIN_DATE = '2025-01-01'; 
const MAX_DATE = '2029-12-31'; 

// --- HELPERS ---
function createSlug(text: string): string {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function getGenreMap(apiKey: string): Promise<Map<number, string>> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es-MX`);
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
    const res = await fetch(`https://api.watchmode.com/v1/title/movie-${tmdbId}/sources/?apiKey=${apiKey}&regions=MX`);
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
                platforms.add(name);
            }
        });
    }
    return Array.from(platforms);
  } catch { return []; }
}

async function fetchTmdbProviders(tmdbId: number, apiKey: string) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${apiKey}`);
        const data = await res.json();
        const mx = data.results?.MX;
        if (!mx || !mx.flatrate) return [];
        return mx.flatrate.map((p: any) => p.provider_name);
    } catch { return []; }
}

async function fetchYouTubeTrailer(query: string, apiKey: string) {
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=1`
    );
    const data = await res.json();
    return data.items?.[0]?.id?.videoId ? `https://www.youtube.com/watch?v=${data.items[0].id.videoId}` : null;
  } catch { return null; }
}

// --- SERVIDOR PRINCIPAL ---

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

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    const genreMap = await getGenreMap(TMDB_KEY);
    let allMoviesToProcess = [];

    // Buscamos películas populares en el rango amplio de fechas
    for (let i = 1; i <= PAGES_PER_RUN; i++) {
        const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=es-MX&region=MX&sort_by=popularity.desc&include_adult=false&page=${i}&primary_release_date.gte=${MIN_DATE}&primary_release_date.lte=${MAX_DATE}&vote_count.gte=50`;
        
        const res = await fetch(tmdbUrl);
        if (res.ok) {
            const data = await res.json();
            allMoviesToProcess.push(...data.results);
        }
    }

    const validEvents = [];
    const chunkSize = 10; 
    
    for (let i = 0; i < allMoviesToProcess.length; i += chunkSize) {
        const chunk = allMoviesToProcess.slice(i, i + chunkSize);
        
        const chunkPromises = chunk.map(async (movie: any) => {
            try {
                if (!movie.backdrop_path && !movie.poster_path) return null;

                const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_KEY}&language=es-MX&append_to_response=videos,credits`);
                const details = await detailsRes.json();
                const imdbId = details.imdb_id;

                let platforms = await fetchWatchmodePlatforms(movie.id, WATCHMODE_KEY || '');
                if (platforms.length === 0) {
                     const tmdbProvs = await fetchTmdbProviders(movie.id, TMDB_KEY);
                     platforms = tmdbProvs || [];
                }

                let finalTrailerUrl = null;
                const tmdbVideos = details.videos?.results || [];
                const officialTrailer = tmdbVideos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) 
                                     || tmdbVideos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
                
                if (officialTrailer) {
                    finalTrailerUrl = `https://www.youtube.com/watch?v=${officialTrailer.key}`;
                } else if (YOUTUBE_KEY) {
                    const year = movie.release_date ? movie.release_date.split('-')[0] : '';
                    finalTrailerUrl = await fetchYouTubeTrailer(`${movie.title} ${year} trailer oficial latino`, YOUTUBE_KEY);
                }

                let finalPlatform = 'Por Anunciar';
                const releaseDate = new Date(movie.release_date);
                const today = new Date();
                
                if (platforms.length > 0) {
                    const priority = ['Netflix', 'Max', 'Disney+', 'Prime Video', 'Apple TV+'];
                    const best = priority.find(p => platforms.some(pf => pf.includes(p)));
                    finalPlatform = best || platforms[0];
                } else if (releaseDate > today) {
                    finalPlatform = 'Solo en Cines';
                } else {
                    finalPlatform = 'VOD / Digital';
                }

                const genres = movie.genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean);

                // --- EXTRAER REPARTO (CAST) ---
                const cast = details.credits?.cast?.slice(0, 12).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    character: c.character,
                    profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
                })) || [];

                return {
                    source_api_id: `tmdb-${movie.id}`,
                    title: movie.title,
                    type: 'movie',
                    platform: finalPlatform,
                    release_date: movie.release_date,
                    status: releaseDate > today ? 'Próximamente' : 'Estreno',
                    description: movie.overview || 'Sinopsis no disponible.',
                    genres: genres,
                    rating: movie.vote_average ? movie.vote_average.toFixed(1) : null,
                    director: details.credits?.crew?.find((c:any) => c.job === 'Director')?.name || null,
                    duration_mins: details.runtime || null,
                    imdb_id: imdbId,
                    image_url: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
                    poster_image_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                    trailer_url: finalTrailerUrl,
                    last_api_update: new Date(),
                    popularity: movie.popularity,
                    original_title: movie.original_title,
                    slug: createSlug(movie.title),
                    // ¡NUEVO CAMPO!
                    cast_detailed: cast
                };
            } catch (e) { return null; }
        });

        const results = await Promise.all(chunkPromises);
        validEvents.push(...results.filter(r => r !== null));
    }

    if (validEvents.length > 0) {
        const result = await supabase
            .from('events')
            .upsert(validEvents, { onConflict: 'source_api_id' }); 
        if (result.error) throw result.error;
    }

    return new Response(JSON.stringify({
        success: true,
        message: `Proceso completado. ${validEvents.length} películas actualizadas (incluye Reparto).`
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});