import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. Importaciones de React Router
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'
import './index.css'

// 2. Importamos nuestras páginas
import HomePage from './pages/HomePage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import SeriesPage from './pages/SeriesPage.jsx';
import SportsPage from './pages/SportsPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import DetailPage from './pages/DetailPage.jsx'; // <-- ¡Nueva página!

// 3. Creamos el "mapa" de nuestro sitio
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App es el "layout" (Header y Footer)
    children: [
      // Outlet() en App.jsx se reemplazará por esto:
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movies",
        element: <MoviesPage />,
      },
      {
        path: "/series",
        element: <SeriesPage />,
      },
      {
        path: "/sports",
        element: <SportsPage />,
      },
      {
        path: "/games",
        element: <GamesPage />,
      },
      // --- ¡Nueva Ruta de Detalle! ---
      // :id es un parámetro dinámico.
      // /event/123 o /event/456 cargarán esta página.
      {
        path: "/event/:id",
        element: <DetailPage />,
      },
    ],
  },
]);

// 4. Renderizamos la aplicación usando el RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)