import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'
import './index.css'

// 1. Importamos TODAS las páginas
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import SeriesPage from './pages/SeriesPage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx'; // <-- ¡NUEVA IMPORTACIÓN!


// 2. Creamos el "mapa" de nuestro sitio
const router = createBrowserRouter([
  {
    // --- RUTA 1: La Landing Page ---
    path: "/",
    element: <LandingPage />,
  },
  {
    // --- RUTA 2: La Aplicación Principal ---
    path: "/app",
    element: <App />, 
    children: [
      {
        index: true, // /app
        element: <HomePage />,
      },
      {
        path: "movies", // /app/movies
        element: <MoviesPage />,
      },
      {
        path: "series", // /app/series
        element: <SeriesPage />,
      },
      {
        path: "my-list", // /app/my-list
        element: <MyListPage />,
      },
      {
        path: "history", // <-- ¡NUEVA RUTA!
        element: <HistoryPage />,
      },
      {
        path: "settings", // /app/settings
        element: <SettingsPage />,
      },
      {
        path: "login", // /app/login
        element: <LoginPage />,
      },
      {
        path: "register", // /app/register
        element: <RegisterPage />,
      },
      {
        path: "event/:id", // /app/event/:id
        element: <DetailPage />,
      },
    ],
  },
]);

// 3. Renderizamos la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)