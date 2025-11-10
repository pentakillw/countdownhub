import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importamos los componentes de enrutamiento
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'; // Usamos ruta relativa
import './index.css'; // Usamos ruta relativa

// 2. Importamos nuestras nuevas páginas
import HomePage from './pages/HomePage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import SeriesPage from './pages/SeriesPage.jsx';
import SportsPage from './pages/SportsPage.jsx';
import GamesPage from './pages/GamesPage.jsx';

// 3. Creamos el enrutador (router) - El "mapa" que faltaba
const router = createBrowserRouter([
  {
    path: "/", // La ruta raíz
    element: <App />, // Usará nuestro Layout (Header/Footer)
    // 'children' son las páginas que se cargarán DENTRO de <App> (en el Outlet)
    children: [
      {
        path: "/", // La ruta exacta "/"
        element: <HomePage />, // Muestra la página de inicio
      },
      {
        path: "/movies", // Ruta /movies
        element: <MoviesPage />, // Muestra la página de películas
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
    ],
  },
]);

// 4. Usamos 'RouterProvider' en lugar de '<App />'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)