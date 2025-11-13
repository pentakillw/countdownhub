import React, { useState } from 'react';
// ¡Importamos Link para los enlaces!
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { UserPlus } from 'lucide-react';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // --- ¡NUEVO ESTADO! ---
  // Estado para la casilla de aceptación
  const [agreed, setAgreed] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // --- ¡NUEVA VALIDACIÓN! ---
    // Verificamos si la casilla está marcada
    if (!agreed) {
      setError("Debes aceptar los Términos y Condiciones y la Política de Privacidad para registrarte.");
      return; // Detenemos el envío
    }

    setLoading(true);
    try {
      const { error } = await register(email, password);
      if (error) throw error;
      setMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      setTimeout(() => navigate('/app/login'), 5000); // <-- Ruta actualizada
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.message || 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-default mb-6 text-center">
        Crear Cuenta
      </h1>
      
      {/* --- ¡CORRECCIÓN AQUÍ! --- */}
      {/* Se eliminó el </div> extra que estaba después de este bloque */}
      {error && (
        <div className="bg-critical-subtle border-l-4 border-border-critical-strong text-text-critical p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-success-subtle border-l-4 border-border-success-strong text-text-success p-4 mb-4" role="alert">
          <p>{message}</p>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-subtle mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-default rounded-lg focus:ring-2 focus:ring-action-primary focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="mb-4"> {/* Reducido el margen de mb-6 a mb-4 */}
            <label htmlFor="password" className="block text-sm font-medium text-subtle mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-default rounded-lg focus:ring-2 focus:ring-action-primary focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
            />
            <p className="text-xs text-subtle mt-1">Mínimo 6 caracteres.</p>
          </div>

          {/* --- ¡NUEVA SECCIÓN DE ACEPTACIÓN! --- */}
          <div className="mb-6">
            <label htmlFor="agree" className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                // Añadimos clases de Tailwind para que se vea bien
                className="mt-0.5 rounded border-gray-t800 text-action-primary focus:ring-action-primary"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="text-sm text-subtle">
                Acepto los{' '}
                <Link to="/app/terms" target="_blank" className="text-action-primary font-medium hover:underline">
                  Términos y Condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/app/privacy" target="_blank" className="text-action-primary font-medium hover:underline">
                  Política de Privacidad
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            // Deshabilitado si está cargando O si no ha aceptado
            disabled={loading || !agreed}
            // Añadimos 'transition-opacity' y 'disabled:opacity-50' para feedback visual
            className="w-full bg-deco-verde-1 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
          >
            <UserPlus size={18} className="mr-2" />
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
      )}

      <p className="text-center text-subtle mt-6">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/app/login" className="text-action-primary font-medium hover:underline"> {/* <-- Ruta actualizada */}
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;