import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-default mb-6">Política de Privacidad de ClicTimes</h1>

      <div className="prose max-w-none text-subtle space-y-4">
        <p><strong>Última actualización: 13 de noviembre de 2025</strong></p>
        
        <p>
          Su privacidad es importante para nosotros. Esta Política de Privacidad explica cómo
          ClicTimes recopila, utiliza, protege y divulga su información personal.
        </p>

        <h2 className="text-xl font-semibold text-default">1. Información que Recopilamos</h2>
        <p>Recopilamos dos tipos de información:</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Información que usted proporciona:</strong> Al crear una cuenta,
            recopilamos su dirección de correo electrónico y la contraseña que proporciona.
          </li>
          <li>
            <strong>Información generada por el uso:</strong> Cuando utiliza funciones
            como "Mi Lista" o "Mi Historial", almacenamos la asociación entre su cuenta
            y los eventos que ha guardado o marcado como vistos.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-default">2. Cómo Utilizamos su Información</h2>
        <p>Utilizamos su información únicamente para:</p>
        <ul className="list-disc pl-5">
          <li>Proporcionar y mantener el Servicio (por ejemplo, para mostrarle su lista personalizada).</li>
          <li>Autenticar su cuenta y protegerla contra el acceso no autorizado.</li>
          <li>Comunicarnos con usted sobre cambios en el servicio o problemas de la cuenta.</li>
        </ul>
        <p>No vendemos, alquilamos ni compartimos su información personal con terceros para fines de marketing.</p>

        <h2 className="text-xl font-semibold text-default">3. Seguridad y Almacenamiento de Datos</h2>
        <p>
          Nos tomamos su seguridad muy en serio. ClicTimes está construido sobre
          <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-action-primary hover:underline">Supabase</a>,
          una plataforma segura que gestiona toda nuestra base de datos y autenticación.
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Autenticación:</strong> Su contraseña es manejada de forma segura por el
            servicio de autenticación de Supabase. Nosotros no tenemos acceso a su
            contraseña en texto plano.
          </li>
          <li>
            <strong>Base de Datos:</strong> Su correo electrónico y los datos de su lista
            ("Mi Lista", "Mi Historial") se almacenan en una base de datos de Supabase,
            protegida con las mejores prácticas de seguridad de la industria.
          </li>
        </ul>
        <p>
          Si bien ningún sistema es 100% seguro, tomamos todas las medidas razonables
          proporcionadas por nuestra infraestructura para proteger su información.
        </p>

        <h2 className="text-xl font-semibold text-default">4. Publicidad (Google AdSense)</h2>
        <p>
          Actualmente, ClicTimes no muestra publicidad. Sin embargo, nos reservamos
          el derecho de implementar Google AdSense en el futuro.
        </p>
        <p>
          Si implementamos AdSense, Google y sus socios pueden utilizar cookies (como
          la cookie de DoubleClick) para mostrar anuncios basados en sus visitas
          anteriores a nuestro sitio web u otros sitios en Internet. Usted puede
          optar por no participar en la publicidad personalizada visitando la
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-action-primary hover:underline">Configuración de anuncios de Google</a>.
        </p>
        
        <h2 className="text-xl font-semibold text-default">5. Sus Derechos</h2>
        <p>
          Usted tiene derecho a acceder, actualizar o eliminar la información personal
          que tenemos sobre usted. Actualmente, puede administrar sus listas y su
          historial directamente desde la aplicación. Para la eliminación de la cuenta,
          por favor contáctenos.
        </p>
        
        <h2 className="text-xl font-semibold text-default">6. Cambios a esta Política</h2>
        <p>
          Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le
          notificaremos cualquier cambio publicando la nueva Política de Privacidad
          en esta página.
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

export default PrivacyPolicyPage;