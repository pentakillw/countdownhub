import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importamos los CSS
import './index.css';

// Importamos el Layout Principal
import App from './App.jsx';

// Importamos todas nuestras páginas
// ¡Usamos rutas absolutas desde /src/ para evitar errores!
import HomePage from '/src/pages/HomePage.jsx';
import MoviesPage from '/src/pages/MoviesPage.jsx';
import SeriesPage from '/src/pages/SeriesPage.jsx';
import SportsPage from '/src/pages/SportsPage.jsx';
import GamesPage from '/src/pages/GamesPage.jsx';
import DetailPage from '/src/pages/DetailPage.jsx'; // <-- ¡NUEVA PÁGINA!

// Este es el "mapa" de nuestro sitio
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El Layout (Header/Footer) se aplica a todas las rutas hijas
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/movies',
        element: <MoviesPage />,
      },
      {
        path: '/series',
        element: <SeriesPage />,
      },
      {
        path: '/sports',
        element: <SportsPage />,
      },
      {
        path: '/games',
        element: <GamesPage />,
      },
      {
        // ¡NUEVA RUTA!
        // El ':id' es un parámetro dinámico.
        // Capturará /event/1, /event/2, /event/abc, etc.
        path: '/event/:id',
        element: <DetailPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);