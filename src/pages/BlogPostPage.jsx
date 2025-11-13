import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Este componente es una plantilla.
// En el futuro, usarías el `slug` para buscar el contenido del post en Supabase.
function BlogPostPage() {
  const { slug } = useParams();

  // --- Contenido de ejemplo ---
  // Este es el contenido que Google AdSense necesita ver (texto original).
  const postContent = {
    title: 'Análisis: El estado del cine de superhéroes en 2025',
    author: 'Admin ClicTimes',
    date: '13 de noviembre de 2025',
    imageUrl: 'https://placehold.co/1200x500/0C0D0F/E6E7EB?text=Superheroes',
    content: (
      <>
        <p className="lead text-lg text-subtle mb-6">
          Tras años de dominio indiscutible en la taquilla mundial, exploramos si el género de
          superhéroes aún tiene la fuerza de antes o si necesita una reinvención urgente.
          La fatiga de las fórmulas y la sobresaturación de contenido parecen estar
          pasando factura.
        </p>
        
        <h3 className="text-2xl font-semibold text-default mt-8 mb-4">La "Fatiga del Superhéroe" es Real</h3>
        <p className="mb-4">
          Lo que antes era un evento cinematográfico bianual se ha convertido en una
          constante mensual, sumando las producciones de cine y las series en plataformas
          de streaming. El público general, que no es fanático de los cómics, comienza
          a sentir que "ya ha visto esta película". Las tramas se vuelven predecibles:
          un héroe descubre sus poderes (o lidia con ellos), un villano amenaza el
          mundo (o una ciudad), y una batalla final llena de CGI resuelve el conflicto.
        </p>
        <p className="mb-4">
          Las cifras de taquilla de los últimos estrenos en 2024 y 2025 muestran una
          tendencia a la baja para proyectos que no son "eventos" (como una nueva
          entrega de Vengadores o la Liga de la Justicia). Las películas de
          origen de personajes secundarios ya no garantizan el éxito.
        </p>

        <blockquote className="border-l-4 border-brand-t450 pl-4 py-2 my-6 text-subtle italic">
          "El desafío ya no es cómo hacer una película de superhéroes, sino cómo
          hacer una *buena película* que, casualmente, es de superhéroes."
        </blockquote>

        <h3 className="text-2xl font-semibold text-default mt-8 mb-4">La Búsqueda de la Originalidad</h3>
        <p className="mb-4">
          No todo está perdido. El éxito rotundo de películas que rompen el molde,
          como "Joker" en su día, o las series animadas que exploran el formato
          (como "Invincible" o "Arcane"), demuestran que el público sigue interesado
          cuando la narrativa es sólida y original.
        </p>
        <p className="mb-4">
          La clave parece estar en diversificar los géneros. Un superhéroe puede
          protagonizar un thriller político (como en 'Capitán América: Soldado de
          Invierno'), una comedia irreverente (como 'Deadpool') o incluso un drama
          psicológico. El traje y los poderes deberían ser el contexto, no la trama
          principal.
        </p>
        <p className="mb-4">
          En ClicTimes, seguiremos de cerca los próximos estrenos. ¿Será que la nueva
          fase de Marvel o el reinicio del universo de DC logran capturar nuevamente
          la magia? Solo el tiempo (y la taquilla) lo dirá.
        </p>
      </>
    )
  };

  // Aquí iría la lógica para cargar el post correcto usando el `slug`
  // Por ahora, solo mostramos el contenido de ejemplo.

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/app/blog"
        className="inline-flex items-center text-brand-t450 font-medium mb-6 hover:text-brand-t400 transition-colors"
      >
        <ArrowLeft size={18} className="mr-1.5" />
        Volver al Blog
      </Link>

      <article className="bg-white p-8 md:p-10 rounded-lg shadow-md border border-gray-t900">
        <h1 className="text-3xl md:text-4xl font-extrabold text-default mb-4">
          {postContent.title}
        </h1>
        <p className="text-subtle text-sm mb-6">
          Por {postContent.author} | Publicado el {postContent.date}
        </p>

        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-strong mb-8">
          <img
            src={postContent.imageUrl}
            alt={`Imagen para ${postContent.title}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenido del Artículo */}
        <div className="prose max-w-none text-subtle space-y-4">
          {postContent.content}
        </div>
      </article>
    </div>
  );
}

export default BlogPostPage;