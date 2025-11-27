import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import CountdownCard from '../components/CountdownCard.jsx';
import HeroFeature from '../components/HeroFeature.jsx'; 
// --- Importamos la Paginación ---
import Pagination from '../components/Pagination.jsx';
import { Search, SlidersHorizontal, TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

function HomePage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  // Estados para el Carrusel
  const [featuredEvents, setFeaturedEvents] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  
  // --- Estados de Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Mostramos 12 tarjetas por página
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // --- Carga de Datos ---
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
            setFeaturedEvents([]);
            setAllEvents([]);
            setFilteredEvents([]);
        }

      } catch (err) {
        console.error("Error al cargar eventos:", err);
        setError("Error de conexión. Verifica tu internet.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [featuredEvents]);

  useEffect(() => {
    if (allEvents.length === 0) return;
    const allGenresLists = allEvents.map(event => event.genres).filter(Boolean); 
    const uniqueGenres = [...new Set(allGenresLists.flat())].sort();
    setAvailableGenres(uniqueGenres);
    const allPlatforms = allEvents.map(event => event.platform).filter(Boolean); 
    const uniquePlatforms = [...new Set(allPlatforms)].sort();
    setAvailablePlatforms(uniquePlatforms);
  }, [allEvents]);

  // --- Lógica de Filtrado y Reinicio de Paginación ---
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
        event.platform && event.platform.includes(selectedPlatform)
      );
    }
    if (selectedDateFilter !== 'all') {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (selectedDateFilter === 'today') {
            processedEvents = processedEvents.filter(event => {
                const d = new Date(event.release_date); d.setHours(0,0,0,0);
                return d.getTime() === now.getTime();
            });
        } else if (selectedDateFilter === 'this-week') {
            const end = new Date(now); end.setDate(now.getDate() + 7);
            processedEvents = processedEvents.filter(event => {
                const d = new Date(event.release_date);
                return d >= now && d <= end;
            });
        } else if (selectedDateFilter === 'upcoming') {
            processedEvents = processedEvents.filter(event => new Date(event.release_date) >= now);
            processedEvents.sort((a,b) => new Date(a.release_date) - new Date(b.release_date));
        }
    } else {
        processedEvents = sortSmartCatalog(processedEvents);
    }

    setFilteredEvents(processedEvents);
    setCurrentPage(1); // Reset a página 1 cuando cambian los filtros
  }, [searchTerm, selectedGenre, selectedDateFilter, selectedPlatform, allEvents]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);

  // --- Lógica de Corte para Paginación ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  // --- Función para Scroll al Top al cambiar de página ---
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Hacemos scroll suave al inicio de la lista, no del todo arriba para mantener el Hero visible si se quiere
    window.scrollTo({ top: 500, behavior: 'smooth' }); 
  };

  return (
    <div>
      {/* 1. SECCIÓN: HERO CARRUSEL */}
      {!loading && !error && !searchTerm && featuredEvents.length > 0 && (
        <div className="mb-12 relative group">
             <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Sparkles className="text-brand-t500 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-subtle">
                    Destacados
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

      {/* 2. SECCIÓN: HEADER Y FILTROS */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 border-b border-border-default pb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-default flex items-center gap-2">
               <TrendingUp className="text-action-primary" /> 
               Explorar Catálogo
            </h1>
            <p className="text-text-subtle mt-1 text-sm">
                Ordenado por proximidad: Lo que viene pronto, primero.
            </p>
        </div>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full shadow-sm border transition-all ${isFiltersOpen ? 'bg-action-primary text-white border-transparent' : 'bg-white dark:bg-bg-muted text-text-default border-border-default hover:border-brand-t500'}`}
        >
          <SlidersHorizontal size={16} />
          <span>Filtros Avanzados</span>
        </button>
      </div>

      {/* 3. SECCIÓN: BUSCADOR */}
      <div className="relative mb-8 group">
        <input
          type="text"
          placeholder="Buscar en el catálogo... (Ej: Stranger Things)"
          className="w-full pl-12 pr-4 py-3 text-base border border-border-default rounded-xl focus:ring-4 focus:ring-brand-t500/10 focus:border-brand-t500 focus:outline-none bg-white dark:bg-bg-muted text-text-default transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle group-focus-within:text-brand-t500 transition-colors" />
      </div>

      {/* 4. SECCIÓN: PANEL DE FILTROS */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFiltersOpen ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 bg-white dark:bg-bg-muted shadow-sm rounded-xl border border-border-default grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-text-subtle tracking-wider">Plataforma</label>
              <select className="w-full p-2.5 bg-bg-default dark:bg-bg-strong rounded-lg border-none focus:ring-2 focus:ring-brand-t500 text-text-default text-sm font-medium" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                <option value="all">📺 Todas</option>
                {availablePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-text-subtle tracking-wider">Género</label>
              <select className="w-full p-2.5 bg-bg-default dark:bg-bg-strong rounded-lg border-none focus:ring-2 focus:ring-brand-t500 text-text-default text-sm font-medium" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                <option value="all">🎭 Todos</option>
                {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-text-subtle tracking-wider">Fecha</label>
              <select className="w-full p-2.5 bg-bg-default dark:bg-bg-strong rounded-lg border-none focus:ring-2 focus:ring-brand-t500 text-text-default text-sm font-medium" value={selectedDateFilter} onChange={(e) => setSelectedDateFilter(e.target.value)}>
                <option value="all">📅 Inteligente</option>
                <option value="upcoming">🚀 Solo Futuros</option>
                <option value="this-week">Esta Semana</option>
                <option value="today">Hoy</option>
              </select>
            </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-brand-t500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-subtle font-medium animate-pulse">Organizando cartelera...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-critical-subtle/20 border border-critical-subtle text-text-critical p-6 rounded-2xl">
          <p className="font-bold text-lg">Ups, algo salió mal</p>
          <p>{error}</p>
        </div>
      )}

      {/* 5. SECCIÓN: GRID DE RESULTADOS (PAGINADO) */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div>
            {selectedDateFilter === 'all' && (
                <div className="mb-4 text-xs font-bold text-text-subtle uppercase tracking-wider opacity-70">
                    Próximos Estrenos ↓
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.map(item => (
                <CountdownCard key={item.id} item={item} />
            ))}
            </div>

            {/* --- COMPONENTE DE PAGINACIÓN --- */}
            <Pagination 
                currentPage={currentPage}
                totalItems={filteredEvents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
         <div className="text-center py-24 bg-bg-muted/30 rounded-3xl border-2 border-dashed border-border-default">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <h3 className="text-xl font-bold text-text-default mb-2">No encontramos coincidencias</h3>
          <p className="text-text-subtle max-w-sm mx-auto text-sm">
            Prueba ajustando los filtros de plataforma o género.
          </p>
          <button onClick={() => { setSearchTerm(''); setSelectedGenre('all'); setSelectedPlatform('all'); }} className="mt-6 text-brand-t500 font-bold hover:underline text-sm">
            Ver todo el catálogo
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;