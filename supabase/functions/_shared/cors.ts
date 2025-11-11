// Este archivo define los encabezados CORS que se reutilizarán
// en todas las funciones de Supabase.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Permite cualquier origen
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};