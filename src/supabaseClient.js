import { createClient } from '@supabase/supabase-js';

// 1. Leemos las variables de entorno desde .env.local (gracias a Vite)
// Vite requiere el prefijo "VITE_" para exponerlas al frontend.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Verificación de seguridad
// Si las variables no están cargadas, mostramos un error en la consola
// para saber que olvidamos rellenar el .env.local
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Faltan variables de entorno de Supabase.'
  );
  console.error(
    'Asegúrate de crear un archivo .env.local en la raíz del proyecto y añadir:'
  );
  console.error('VITE_SUPABASE_URL="tu-url"');
  console.error('VITE_SUPABASE_ANON_KEY="tu-llave-anon"');
  // Detenemos la app si faltan las claves
  throw new Error('Faltan claves de Supabase. Revisa el archivo .env.local y reinicia el servidor.');
}

// 3. Creamos y exportamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);