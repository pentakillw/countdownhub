import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient.js';

// 1. Creamos el Contexto y ¡LO EXPORTAMOS!
export const AuthContext = createContext();

// 2. Creamos el Proveedor (AuthProvider)
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificamos la sesión del usuario al cargar la app
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escuchamos cambios en el estado de autenticación (login, logout)
    // --- ¡ERROR CORREGIDO AQUÍ! ---
    // Se eliminó la llave '}' extra
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpiamos el listener al desmontar
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 3. Funciones que el contexto expondrá
  const value = {
    user,
    loading,
    login: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    logout: () => supabase.auth.signOut(),
    register: (email, password) => supabase.auth.signUp({ email, password }),
  };

  // 4. Retornamos el proveedor
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}