import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'
import './index.css'
import ThemeProvider from './contexts/ThemeContext.jsx';
import ToastProvider from './contexts/ToastContext.jsx';
// --- NUEVO: Importamos ScrollToTop ---
import ScrollToTop from './components/ScrollToTop.jsx';

// --- LAZY LOADING ---
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx')); 
const MoviesPage = lazy(() => import('./pages/MoviesPage.jsx'));
const SeriesPage = lazy(() => import('./pages/SeriesPage.jsx'));
const DetailPage = lazy(() => import('./pages/DetailPage.jsx'));
const MyListPage = lazy(() => import('./pages/MyListPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx')); 
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-brand-t500/30 border-t-brand-t500 rounded-full animate-spin"></div>
  </div>
);

// Wrapper para inyectar ScrollToTop dentro del RouterProvider
const AppLayout = ({ children }) => (
  <>
    <ScrollToTop />
    {children}
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <LandingPage />
        </Suspense>
      </AppLayout>
    ),
  },
  {
    path: "/app",
    element: (
      <AppLayout>
        <App />
      </AppLayout>
    ), 
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: "movies", element: <Suspense fallback={<PageLoader />}><MoviesPage /></Suspense> },
      { path: "series", element: <Suspense fallback={<PageLoader />}><SeriesPage /></Suspense> },
      { path: "my-list", element: <Suspense fallback={<PageLoader />}><MyListPage /></Suspense> },
      { path: "history", element: <Suspense fallback={<PageLoader />}><HistoryPage /></Suspense> },
      { path: "settings", element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
      { path: "login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
      { path: "terms", element: <Suspense fallback={<PageLoader />}><TermsAndConditionsPage /></Suspense> },
      { path: "privacy", element: <Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense> },
      { path: "blog", element: <Suspense fallback={<PageLoader />}><BlogPage /></Suspense> },
      { path: "blog/:slug", element: <Suspense fallback={<PageLoader />}><BlogPostPage /></Suspense> },
      { path: "event/:id", element: <Suspense fallback={<PageLoader />}><DetailPage /></Suspense> },
      { path: "*", element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
    ],
  },
  {
    path: "*",
    element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
)