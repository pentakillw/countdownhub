import { useContext } from 'react';
// Importamos el Contexto desde el archivo de contexto
import { AuthContext } from '../contexts/AuthContext.jsx';

// 5. Hook personalizado para usar el contexto fácilmente
// Esta es la función que movimos aquí
export function useAuth() {
  return useContext(AuthContext);
}