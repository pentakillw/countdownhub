import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import CountdownCard from '../components/CountdownCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { Star, LogIn, Search, Filter } from 'lucide-react';

function MyListPage() {
  const { user } = useAuth();
  const { favorites, loadingFavorites } = useFavorites();

  const [allFavoriteEvents, setAllFavoriteEvents] = useState([]); // Todos los datos
  const [displayedEvents, setDisplayedEvents] = useState([]);     // Datos filtrados para mostrar
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  // --- Estados de Filtro Local ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'movie', 'tv'

  useEffect(() => {
    if (loadingFavorites) return;
    
    if (!user || favorites.length === 0) {
      setAllFavoriteEvents([]);
      setDisplayedEvents([]);
      setLoadingEvents(false);
      return;
    }

    const fetchFavoriteEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .in('id', favorites)
          .order('release_date', { ascending: true }); // Orden por defecto: Más próximos primero
        
        if (error) throw error;
        setAllFavoriteEvents(data);
        setDisplayedEvents(data);
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
        setError("No se pudieron cargar tus eventos guardados.");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchFavoriteEvents();
  }, [favorites, user, loadingFavorites]);

  // --- Efecto de Filtrado Local ---
  useEffect(() => {
    let result = [...allFavoriteEvents];

    // 1. Filtro por Texto
    if (searchTerm.trim() !== '') {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(e => e.title.toLowerCase().includes(lowerTerm));
    }

    // 2. Filtro por Tipo
    if (filterType !== 'all') {
        result = result.filter(e => e.type === filterType);
    }

    setDisplayedEvents(result);
  }, [searchTerm, filterType, allFavoriteEvents]);

  const isLoading = loadingFavorites || loadingEvents;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text-default flex items-center gap-3">
          <Star className="text-yellow-400 fill-current" size={32} />
          Mi Lista
        </h1>
        
        {/* --- Contador de Items --- */}
        {user && !isLoading && (
            <span className="bg-bg-muted text-text-subtle px-3 py-1 rounded-full text-sm font-semibold">
                {allFavoriteEvents.length} Guardados
            </span>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-brand-t500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-text-subtle">Sincronizando tu lista...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-critical-subtle text-text-critical p-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !user && (
        <div className="text-center py-20 bg-white dark:bg-bg-muted rounded-lg shadow-md border border-border-default">
          <LogIn size={48} className="mx-auto text-action-primary mb-4" />
          <h3 className="text-2xl font-bold text-text-default mb-2">Inicia sesión para ver tu lista</h3>
          <p className="text-lg text-text-subtle mb-6">
            Guarda tus estrenos favoritos en un solo lugar.
          </p>
          <Link 
            to="/app/login"
            className="inline-flex items-center justify-center px-6 py-3 font-bold bg-action-primary text-text-on-accent rounded-xl shadow-lg transition-transform duration-200 hover:scale-105"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}

      {!isLoading && user && allFavoriteEvents.length === 0 && (
         <div className="text-center py-24 bg-white dark:bg-bg-muted rounded-lg shadow-sm border border-dashed border-border-strong">
          <Star size={48} className="mx-auto text-bg-subtle mb-4" /> 
          <h3 className="text-xl font-bold text-text-default mb-2">Tu lista está vacía</h3>
          <p className="text-text-subtle max-w-md mx-auto">
            Explora el catálogo y pulsa el corazón (❤️) en las tarjetas para guardar lo que quieres ver.
          </p>
          <Link to="/app" className="mt-6 inline-block text-action-primary font-bold hover:underline">
            Ir al Catálogo
          </Link>
        </div>
      )}

      {/* --- BARRA DE HERRAMIENTAS (Solo si hay items) --- */}
      {!isLoading && user && allFavoriteEvents.length > 0 && (
        <div className="mb-8 bg-white dark:bg-bg-muted p-4 rounded-xl shadow-sm border border-border-default flex flex-col md:flex-row gap-4">
            
            {/* Buscador */}
            <div className="relative flex-grow">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
                <input 
                    type="text" 
                    placeholder="Buscar en tu lista..." 
                    className="w-full pl-10 pr-4 py-2 bg-bg-default border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-t500 text-text-default"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filtro de Tipo */}
            <div className="relative min-w-[180px]">
                <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
                <select 
                    className="w-full pl-10 pr-8 py-2 bg-bg-default border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-t500 text-text-default appearance-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">Todo</option>
                    <option value="movie">Solo Películas</option>
                    <option value="tv">Solo Series</option>
                </select>
            </div>
        </div>
      )}

      {/* --- GRID DE RESULTADOS --- */}
      {!isLoading && user && displayedEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedEvents.map(item => (
            <CountdownCard key={item.id} item={item} />
          ))}
        </div>
      )}
      
      {!isLoading && user && allFavoriteEvents.length > 0 && displayedEvents.length === 0 && (
          <div className="text-center py-12">
              <p className="text-text-subtle">No se encontraron resultados para "{searchTerm}" en tu lista.</p>
              <button 
                onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                className="mt-2 text-action-primary font-bold hover:underline"
              >
                Limpiar búsqueda
              </button>
          </div>
      )}

    </div>
  );
}

export default MyListPage;