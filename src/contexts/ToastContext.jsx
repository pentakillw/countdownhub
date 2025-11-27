import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Función para lanzar una notificación
  // type: 'success', 'error', 'info'
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto eliminar después de 3 segundos
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Contenedor de Toasts (Fijo en la pantalla) */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border
              transform transition-all duration-300 animate-in slide-in-from-right-10 fade-in
              ${toast.type === 'success' ? 'bg-white dark:bg-gray-800 border-green-500 text-green-600 dark:text-green-400' : ''}
              ${toast.type === 'error' ? 'bg-white dark:bg-gray-800 border-red-500 text-red-600 dark:text-red-400' : ''}
              ${toast.type === 'info' ? 'bg-white dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-blue-400' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            
            <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}