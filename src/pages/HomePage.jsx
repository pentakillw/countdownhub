import React, { useState, useEffect } from 'react';
// ¡ERROR CORREGIDO! Faltaba el .js
import { supabase } from '../supabaseClient.js';
// ¡ERROR CORREGIDO! Faltaba el .jsx
import CountdownCard from '../components/CountdownCard.jsx';
import { Search, Filter } from 'lucide-react';

function HomePage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Efecto 1: Cargar Datos Iniciales (¡RESTAURADO!) ---
  // Volvemos a filtrar solo próximos estrenos en la Home
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      // Restauramos el filtro de fecha de "hoy"
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*') 
          .gte('release_date', todayISO) // <-- ¡FILTRO RESTAURADO!
          .order('release_date', { ascending: true }); // <-- Orden ascendente

        if (error) throw error;
        
        setAllEvents(data);
        setFilteredEvents(data);

      } catch (err) {
        console.error("Error al cargar eventos:", err);
        // (Antes: "todos los eventos") -> "próximos estrenos"
        setError("No se pudieron cargar los próximos estrenos. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // --- Efecto 2: Generar Listas de Filtros ---
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

  // --- Efecto 3: Aplicar Filtros ---
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
    if (selectedDateFilter !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selectedDateFilter === 'today') {
        processedEvents = processedEvents.filter(event => {
          const eventDate = new Date(event.release_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === now.getTime();
        });
      } 
      else if (selectedDateFilter === 'this-week') {
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        processedEvents = processedEvents.filter(event => {
          const eventDate = new Date(event.release_date);
          return eventDate >= now && eventDate <= endOfWeek;
        });
      } 
      else if (selectedDateFilter === 'this-month') {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        processedEvents = processedEvents.filter(event => {
          const eventDate = new Date(event.release_date);
          return eventDate >= now && eventDate <= endOfMonth;
        });
      }
    }
    if (selectedPlatform !== 'all') {
      processedEvents = processedEvents.filter(event => 
        event.platform === selectedPlatform
      );
    }
    setFilteredEvents(processedEvents);
  }, [searchTerm, selectedGenre, selectedDateFilter, selectedPlatform, allEvents]);

  return (
    <div>
      {/* --- ¡MIGRADO! --- */}
      {/* (Antes: text-brand-text) -> 'text-default' */}
      <h1 className="text-3xl md:text-4xl font-bold text-default mb-8">
        Próximos Estrenos
      </h1>

      {/* --- SECCIÓN DE FILTROS (MIGRADA) --- */}
      <div className="mb-8 p-4 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="relative">
            {/* (Antes: text-brand-gray) -> 'text-subtle' */}
            <label htmlFor="search" className="block text-sm font-medium text-subtle mb-1">Buscar por título</label>
            <input
              type="text"
              id="search"
              placeholder="Ej: La Casa del Dragón..."
              // (Antes: border-brand-gray/30) -> 'border-default'
              // (Antes: focus:ring-brand-blue) -> 'focus:ring-action-primary'
              className="w-full pl-10 pr-4 py-2 border border-default rounded-lg focus:ring-2 focus:ring-action-primary focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* (Antes: text-brand-gray/60) -> 'text-subtle' */}
            <Search size={20} className="absolute left-3 top-9 text-subtle" />
          </div>

          <div className="relative">
            <label htmlFor="genre" className="block text-sm font-medium text-subtle mb-1">Género</label>
            <select
              id="genre"
              className="w-full pl-10 pr-4 py-2 border border-default rounded-lg appearance-none focus:ring-2 focus:ring-action-primary focus:outline-none"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              disabled={availableGenres.length === 0}
            >
              <option value="all">Todos los géneros</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <Filter size={20} className="absolute left-3 top-9 text-subtle" />
          </div>
          
          <div className="relative">
            <label htmlFor="date" className="block text-sm font-medium text-subtle mb-1">Fecha de estreno</label>
            <select
              id="date"
              className="w-full pl-10 pr-4 py-2 border border-default rounded-lg appearance-none focus:ring-2 focus:ring-action-primary focus:outline-none"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
            >
              <option value="all">Cualquier fecha</option>
              <option value="today">Hoy</option>
              <option value="this-week">Esta Semana</option>
              <option value="this-month">Este Mes</option>
            </select>
            <Filter size={20} className="absolute left-3 top-9 text-subtle" />
          </div>

          <div className="relative">
            <label htmlFor="platform" className="block text-sm font-medium text-subtle mb-1">Plataforma</label>
            <select
              id="platform"
              className="w-full pl-10 pr-4 py-2 border border-default rounded-lg appearance-none focus:ring-2 focus:ring-action-primary focus:outline-none"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              disabled={availablePlatforms.length === 0} 
            >
              <option value="all">Todas las plataformas</option>
              {availablePlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <Filter size={20} className="absolute left-3 top-9 text-subtle" />
          </div>

        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
          {/* (Antes: text-brand-gray) -> 'text-subtle' */}
          <p className="text-lg text-subtle">Cargando estrenos...</p>
        </div>
      )}

      {error && (
        // Usamos los nuevos colores semánticos
        <div className="text-center py-10 bg-critical-subtle text-text-critical p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredEvents.map(item => (
            <CountdownCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
         <div className="text-center py-20 bg-white rounded-lg shadow-md">
          {/* (Antes: text-brand-text) -> 'text-default' */}
          <h3 className="text-2xl font-bold text-default mb-2">Sin resultados</h3>
          {/* (Antes: text-brand-gray) -> 'text-subtle' */}
          <p className="text-lg text-subtle">
            {allEvents.length > 0
              ? 'No se encontraron eventos que coincidan con tus filtros.'
              : 'No hay próximos estrenos programados por el momento.'
            }
          </p>
          {(searchTerm || selectedGenre !== 'all' || selectedDateFilter !== 'all' || selectedPlatform !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
                setSelectedDateFilter('all');
                setSelectedPlatform('all'); 
              }}
              // (Antes: bg-brand-blue) -> 'bg-action-primary'
              className="mt-6 px-5 py-2 font-medium bg-action-primary text-white rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;