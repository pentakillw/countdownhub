import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, AlertTriangle, User, Mail, Shield } from 'lucide-react';

function SettingsPage() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleNotifications = async (e) => {
    const isEnabled = e.target.checked;
    setLoading(true);
    // Simulación de delay
    setTimeout(() => {
        setNotificationsEnabled(isEnabled);
        setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-text-default mb-8">
        Configuración
      </h1>

      {/* --- SECCIÓN 1: PERFIL (MEJORA VISUAL) --- */}
      <div className="bg-white dark:bg-bg-muted rounded-2xl shadow-sm border border-border-default p-6 mb-8">
        <h2 className="text-xl font-bold text-text-default mb-6 flex items-center gap-2">
            <User className="text-action-primary" size={24} />
            Mi Perfil
        </h2>
        
        <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-brand-t100 dark:bg-brand-t900 flex items-center justify-center text-action-primary font-bold text-3xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="flex-grow">
                <div className="mb-1">
                    <label className="text-xs font-bold text-text-subtle uppercase tracking-wider">Correo Electrónico</label>
                    <div className="flex items-center gap-2 text-text-default font-medium mt-1">
                        <Mail size={16} className="text-text-subtle" />
                        {user?.email || 'No conectado'}
                    </div>
                </div>
                <div className="mt-4">
                    <label className="text-xs font-bold text-text-subtle uppercase tracking-wider">ID de Usuario</label>
                    <div className="flex items-center gap-2 text-text-subtle text-sm mt-1 font-mono bg-bg-default p-2 rounded w-full md:w-auto truncate">
                        <Shield size={14} />
                        {user?.id || '---'}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- SECCIÓN 2: NOTIFICACIONES --- */}
      <div className="bg-white dark:bg-bg-muted rounded-2xl shadow-sm border border-border-default p-6">
        <h2 className="text-xl font-bold text-text-default mb-6 flex items-center gap-2">
            <Bell className="text-action-primary" size={24} />
            Preferencias
        </h2>
        
        {error && (
          <div className="bg-critical-subtle border-l-4 border-border-critical-strong text-text-critical p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <div className="pr-4">
            <span className="block font-medium text-text-default">Notificaciones Push</span>
            <span className="text-sm text-text-subtle">
              Recibe alertas cuando se estrenen tus favoritos.
            </span>
          </div>
          
          <div className="relative inline-block w-12 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              disabled={loading}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
              style={{ 
                  right: notificationsEnabled ? '0' : 'auto', 
                  left: notificationsEnabled ? 'auto' : '0',
                  borderColor: notificationsEnabled ? '#23C764' : '#e5e7eb'
              }}
            />
            <label
              htmlFor="notifications"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${notificationsEnabled ? 'bg-deco-verde-1' : 'bg-gray-300 dark:bg-gray-700'}`}
            ></label>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-info-subtle/20 border border-info-subtle rounded-xl flex gap-3">
            <AlertTriangle size={20} className="text-text-info flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-subtle">
              <strong>Nota:</strong> Las notificaciones reales requieren permisos del navegador que se solicitarán cuando la función salga de fase beta.
            </p>
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;