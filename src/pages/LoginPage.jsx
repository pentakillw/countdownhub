import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      navigate('/app'); 
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // --- ¡MODIFICACIÓN! Fondo semántico ---
    <div className="max-w-md mx-auto bg-white dark:bg-bg-muted p-8 rounded-lg shadow-md mt-10">
      {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
      <h1 className="text-3xl font-bold text-text-default mb-6 text-center">
        Iniciar Sesión
      </h1>
      
      {error && (
        <div className="bg-critical-subtle border-l-4 border-border-critical-strong text-text-critical p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <label htmlFor="email" className="block text-sm font-medium text-text-subtle mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            // --- ¡MODIFICACIÓN! Borde y fondo semánticos ---
            className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-action-primary focus:outline-none bg-white dark:bg-bg-default"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        
        <div className="mb-6">
          {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
          <label htmlFor="password" className="block text-sm font-medium text-text-subtle mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            // --- ¡MODIFICACIÓN! Borde y fondo semánticos ---
            className="w-full px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-action-primary focus:outline-none bg-white dark:bg-bg-default"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          // --- ¡MODIFICACIÓN! Colores semánticos ---
          className="w-full bg-action-primary text-text-on-accent py-2 px-4 rounded-lg font-medium hover:bg-action-primary-hover transition-opacity flex items-center justify-center disabled:opacity-50"
        >
          <LogIn size={18} className="mr-2" />
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
      <p className="text-center text-text-subtle mt-6">
        ¿No tienes una cuenta?{' '}
        <Link to="/app/register" className="text-action-primary font-medium hover:underline"> 
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;