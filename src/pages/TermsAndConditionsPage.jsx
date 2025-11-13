import React from 'react';
import { Link } from 'react-router-dom';

function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-default mb-6">Términos y Condiciones de ClicTimes</h1>
      
      <div className="prose max-w-none text-subtle space-y-4">
        <p><strong>Última actualización: 13 de noviembre de 2025</strong></p>

        <p>
          Bienvenido a ClicTimes. Al acceder y utilizar nuestro sitio web (el "Servicio"),
          usted acepta estar sujeto a los siguientes términos y condiciones (los "Términos").
          Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
        </p>

        <h2 className="text-xl font-semibold text-default">1. Cuentas de Usuario</h2>
        <p>
          Para acceder a ciertas funciones, como "Mi Lista" y "Mi Historial", debe crear una
          cuenta. Usted es responsable de salvaguardar la contraseña que utiliza para acceder
          al Servicio y de cualquier actividad o acción bajo su contraseña.
        </p>
        <p>
          Utilizamos <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-action-primary hover:underline">Supabase</a> para gestionar la autenticación de usuarios,
          proporcionando un método seguro y estándar de la industria para el manejo de sus
          credenciales. No almacenamos su contraseña directamente; solo manejamos la información
          de autenticación proporcionada por Supabase.
        </p>

        <h2 className="text-xl font-semibold text-default">2. Contenido y Licencias</h2>
        <p>
          ClicTimes es un servicio de seguimiento de fechas de estreno. No alojamos
          ni distribuimos ningún contenido de video o película.
        </p>
        <p>
          Toda la información sobre películas y series, incluyendo, entre otros, títulos,
          sinopsis, pósteres, imágenes de fondo y fechas de estreno, se obtiene de
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-action-primary hover:underline">The Movie Database (TMDB)</a>.
          Este contenido se proporciona "tal cual". No garantizamos la precisión, integridad
          o puntualidad de esta información. ClicTimes utiliza la API de TMDB pero no está
          respaldado ni certificado por TMDB.
        </p>

        <h2 className="text-xl font-semibold text-default">3. Conducta del Usuario</h2>
        <p>Usted acepta no utilizar el Servicio para:</p>
        <ul className="list-disc pl-5">
          <li>Violar cualquier ley local, estatal, nacional o internacional.</li>
          <li>Realizar cualquier actividad que sea abusiva, amenazante, obscena o difamatoria.</li>
          <li>
            Intentar interferir con el funcionamiento adecuado del Servicio, incluyendo
            el uso de bots, scripts o cualquier forma de "scraping".
          </li>
          <li>Suplantar a cualquier persona o entidad, o declarar falsamente su afiliación.</li>
        </ul>

        <h2 className="text-xl font-semibold text-default">4. Publicidad y Enlaces de Terceros</h2>
        <p>
          En el futuro, ClicTimes puede mostrar publicidad de redes de terceros, como
          Google AdSense. Al utilizar nuestro Servicio, usted acepta que podemos colocar
          dicha publicidad. Las prácticas de estos anunciantes se rigen por sus propias
          políticas de privacidad, no por la nuestra.
        </p>
        <p>
          El Servicio puede contener enlaces a sitios web o servicios de terceros que
          no son propiedad ni están controlados por ClicTimes. No tenemos control sobre,
          y no asumimos ninguna responsabilidad por, el contenido, las políticas de
          privacidad o las prácticas de los sitios o servicios de terceros.
        </p>

        <h2 className="text-xl font-semibold text-default">5. Limitación de Responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley aplicable, en ningún caso ClicTimes
          será responsable de ningún daño indirecto, incidental, especial, consecuente
          o punitivo... (etc.)
        </p>
        
        <h2 className="text-xl font-semibold text-default">6. Cambios a estos Términos</h2>
        <p>
          Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar
          estos Términos en cualquier momento. Le notificaremos cualquier cambio publicando
          los nuevos Términos en esta página.
        </p>
        
        <h2 className="text-xl font-semibold text-default">7. Contacto</h2>
        <p>
          Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a través
          de los canales proporcionados en el sitio.
        </p>

        <div className="pt-6 text-center">
            <Link 
              to="/app" 
              className="inline-flex items-center justify-center px-5 py-2 font-medium bg-action-primary text-white rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            >
              Volver al inicio
            </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditionsPage;