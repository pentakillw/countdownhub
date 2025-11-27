import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import CountdownCard from '../components/CountdownCard.jsx';
import Pagination from '../components/Pagination.jsx';
import HeroFeature from '../components/HeroFeature.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx'; // ¡Importante: Importamos el Skeleton!
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles, Film } from 'lucide-react';

function MoviesPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sortSmartCatalog = (events) => {
      const now = new Date();
      now.setHours(0,0,0,0);
      const upcoming = [];
      const past = [];
      
      events.forEach(event => {
          const rDate = new Date(event.release_date);
          rDate.setHours(0,0,0,0);
          if (rDate >= now) upcoming.push(event);
          else past.push(event);
      });

      upcoming.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      past.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

      return [...upcoming, ...past];
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      const recentPast = new Date();
      recentPast.setDate(recentPast.getDate() - 60); 
      const recentPastISO = recentPast.toISOString();

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('type', 'movie')
          .gte('release_date', recentPastISO);
        
        if (error) throw error;

        if (data && data.length > 0) {
            const now = new Date();
            now.setHours(0,0,0,0);

            const upcomingEvents = data.filter(e => new Date(e.release_date) >= now);
            const releasedEvents = data.filter(e => new Date(e.release_date) < now);

            upcomingEvents.sort((a, b) => b.popularity - a.popularity);
            releasedEvents.sort((a, b) => b.popularity - a.popularity);

            let heroSelection = [...upcomingEvents].slice(0, 5);
            if (heroSelection.length < 5) {
                const needed = 5 - heroSelection.length;
                heroSelection = [...heroSelection, ...releasedEvents.slice(0, needed)];
            }
            setFeaturedEvents(heroSelection);

            const sortedCatalog = sortSmartCatalog(data);
            setAllEvents(sortedCatalog);
            setFilteredEvents(sortedCatalog);
        } else {
            setAllEvents([]);
            setFilteredEvents([]);
        }

      } catch (err) {
        console.error("Error al cargar películas:", err);
        setError("No se pudieron cargar las películas. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [featuredEvents]);

  useEffect(() => {
    if (allEvents.length === 0) return;
    const allGenresLists = allEvents.map(event => event.genres).filter(Boolean); 
    const flatGenres = allGenresLists.flat();
    const uniqueGenres = [...new Set(flatGenres)];
    uniqueGenres.sort();
    setAvailableGenres(uniqueGenres);
    const allPlatforms = allEvents.map(event => event.platform).filter(Boolean); 
    const uniquePlatforms = [...new Set(allPlatforms)];
    uniquePlatforms.sort();
    setAvailablePlatforms(uniquePlatforms);
  }, [allEvents]);

  useEffect(() => {
    let processedEvents = [...allEvents];
    
    if (searchTerm.trim() !== '') {
      const lowerCaseSearch = searchTerm.toLowerCase();
      processedEvents = processedEvents.filter(event => 
        event.title.toLowerCase().includes(lowerCaseSearch)
      );
    }
    if (selectedGenre !== 'all') {
      processedEvents = processedEvents.filter(event => 
        event.genres && event.genres.includes(selectedGenre)
      );
    }
    if (selectedPlatform !== 'all') {
      processedEvents = processedEvents.filter(event => 
        event.platform === selectedPlatform
      );
    }

    if (selectedDateFilter !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selectedDateFilter === 'today') {
        processedEvents = processedEvents.filter(event => {
          const eventDate = new Date(event.release_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === now.getTime();
        });
      } else if (selectedDateFilter === 'this-week') {
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        processedEvents = processedEvents.filter(event => {
          const eventDate = new Date(event.release_date);
          return eventDate >= now && eventDate <= endOfWeek;
        });
      } else if (selectedDateFilter === 'upcoming') {
          processedEvents = processedEvents.filter(event => new Date(event.release_date) >= now);
          processedEvents.sort((a,b) => new Date(a.release_date) - new Date(b.release_date));
      }
    } else {
        processedEvents = sortSmartCatalog(processedEvents);
    }

    setFilteredEvents(processedEvents);
    setCurrentPage(1); 
  }, [searchTerm, selectedGenre, selectedDateFilter, selectedPlatform, allEvents]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <div>
      {/* 1. SECCIÓN: HERO CARRUSEL */}
      {!loading && !error && !searchTerm && featuredEvents.length > 0 && (
        <div className="mb-12 relative group">
             <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Film className="text-action-primary animate-bounce" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-subtle">
                    Películas Destacadas
                </h2>
             </div>
             <div className="relative">
                 <HeroFeature event={featuredEvents[currentSlide]} />
                 {featuredEvents.length > 1 && (
                     <>
                        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                            <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {featuredEvents.map((_, idx) => (
                                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}`} />
                            ))}
                        </div>
                     </>
                 )}
             </div>
        </div>
      )}

      {/* 2. HEADER Y FILTROS */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text-default flex items-center gap-2">
          <Sparkles className="text-yellow-500" />
          Cartelera de Cine
        </h1>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 font-medium bg-white dark:bg-bg-muted text-text-subtle rounded-lg shadow-sm border border-border-default hover:bg-bg-muted hover:text-text-default transition-colors"
        >
          <SlidersHorizontal size={20} />
          <span className="hidden sm:inline">Filtros</span>
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar películas... (Ej: Gladiator II)"
          className="w-full pl-10 pr-4 py-3 border border-border-default rounded-lg focus:ring-2 focus:ring-action-primary focus:outline-none bg-white dark:bg-bg-muted text-text-default"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
      </div>

      {isFiltersOpen && (
        <div className="mb-8 p-4 bg-white dark:bg-bg-muted shadow-md rounded-lg filters-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-text-subtle mb-1">Género</label>
              <select
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg appearance-none focus:ring-2 focus:ring-action-primary focus:outline-none bg-white dark:bg-bg-default text-text-default"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">Todos los géneros</option>
                {availableGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <Filter size={20} className="absolute left-3 top-9 text-text-subtle" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-text-subtle mb-1">Fecha</label>
              <select
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg appearance-none focus:ring-2 focus:ring-action-primary focus:outline-none bg-white dark:bg-bg-default text-text-default"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
              >
                <option value="all">📅 Inteligente (Recomendado)</option>
                <option value="upcoming">🚀 Próximamente</option>
                <option value="today">Hoy</option>
              </select>
              <Filter size={20} className="absolute left-3 top-9 text-text-subtle" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-text-subtle mb-1">Plataforma</label>
              <select
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg appearance-none focus:ring-2 focus:ring-action-primary focus:outline-none bg-white dark:bg-bg-default text-text-default"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">Todas</option>
                {availablePlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <Filter size={20} className="absolute left-3 top-9 text-text-subtle" />
            </div>
          </div>
        </div>
      )}

      {/* --- ESTADO DE CARGA MEJORADO CON SKELETONS --- */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
           {/* Generamos 6 tarjetas vacías (skeletons) */}
           {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
           ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-critical-subtle text-text-critical p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <div>
            {selectedDateFilter === 'all' && (
                <div className="mb-4 text-xs font-bold text-text-subtle uppercase tracking-wider opacity-70 border-b border-border-default pb-2">
                    Próximos Estrenos ↓
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentEvents.map(item => (
                <CountdownCard key={item.id} item={item} />
            ))}
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalItems={filteredEvents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
         <div className="text-center py-20 bg-white dark:bg-bg-muted rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-text-default mb-2">Sin resultados</h3>
          <p className="text-lg text-text-subtle">No hay películas con estos filtros.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedGenre('all'); setSelectedDateFilter('all'); setSelectedPlatform('all'); }}
            className="mt-6 px-5 py-2 font-medium bg-action-primary text-text-on-accent rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;