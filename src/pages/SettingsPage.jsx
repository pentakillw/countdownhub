import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, AlertTriangle } from 'lucide-react';

function SettingsPage() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleNotifications = async (e) => {
    const isEnabled = e.target.checked;
    setLoading(true);
    setError(null);
    
    if (isEnabled) {
      // --- Lógica para SUSCRIBIRSE ---
      // (En un futuro, aquí llamaremos al service worker)
      console.log('Intentando activar notificaciones...');
      try {
        // 1. Pedir permiso
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Permiso de notificaciones denegado por el usuario.');
        }
        
        // 2. (Simulación) Obtener suscripción (esto es más complejo en la vida real)
        console.log('Permiso concedido. (Simulación de suscripción...)');
        // Aquí iría la lógica para registrar el 'service worker' y
        // obtener el 'pushManager.subscribe()'
        
        // 3. (Simulación) Guardar en Supabase
        // const { error: dbError } = await supabase.from('push_subscriptions').insert({ ... });
        
        setNotificationsEnabled(true);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setNotificationsEnabled(false);
      }
    } else {
      // --- Lógica para DESUSCRIBIRSE ---
      console.log('Desactivando notificaciones...');
      // (Simulación) Aquí borraríamos la suscripción de Supabase
      setNotificationsEnabled(false);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-default mb-8">
        Configuración
      </h1>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-default mb-6">
          Notificaciones
        </h2>
        
        {error && (
          <div className="bg-critical-subtle border-l-4 border-border-critical-strong text-text-critical p-4 mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label htmlFor="notifications" className="flex flex-col pr-4">
            <span className="font-medium text-default">Activar Notificaciones Push</span>
            <span className="text-sm text-subtle">
              Recibe un aviso cuando un estreno de "Mi Lista" esté por llegar.
            </span>
          </label>
          
          {/* Toggle Switch (usando un checkbox estilizado) */}
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="notifications"
              id="notifications"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              disabled={loading}
              className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="notifications"
              className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-t800 cursor-pointer"
            ></label>
          </div>
        </div>
        
        {/* Estilos para el Toggle (pueden ir en index.css) */}
        <style>{`
          .toggle-checkbox:checked {
            right: 0;
            border-color: #23C764; /* deco-verde-1 */
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #23C764; /* deco-verde-1 */
          }
        `}</style>
        
        {loading && (
          <p className="text-sm text-subtle mt-4">Actualizando...</p>
        )}
        
        <div className="mt-6 p-4 bg-bg-muted rounded-lg">
          <div className="flex">
            <AlertTriangle size={20} className="text-subtle mr-3 flex-shrink-0" />
            <p className="text-sm text-subtle">
              Esta función es experimental. Las notificaciones Push requieren un Service Worker y configuración HTTPS en producción que no están implementados en este prototipo.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;