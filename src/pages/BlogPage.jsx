import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// --- Datos de ejemplo para el blog ---
// Deberás reemplazar esto con datos de Supabase en el futuro
const blogPosts = [
  {
    slug: 'analisis-cine-superheroes-2025',
    title: 'Análisis: El estado del cine de superhéroes en 2025',
    excerpt: 'Tras años de dominio, exploramos si el género aún tiene la fuerza de antes o si necesita una reinvención urgente...',
    date: '13 de noviembre de 2025',
    author: 'Admin ClicTimes',
    imageUrl: 'https://placehold.co/600x400/0C0D0F/E6E7EB?text=Superheroes'
  },
  {
    slug: 'mejores-series-streaming-noviembre',
    title: 'Las 5 series que no te puedes perder en Noviembre',
    excerpt: 'El streaming no descansa. Te recomendamos 5 joyas que llegan este mes y que no querrás dejar pasar...',
    date: '11 de noviembre de 2025',
    author: 'Admin ClicTimes',
    imageUrl: 'https://placehold.co/600x400/3D414A/F2F3F4?text=Series'
  },
  {
    slug: 'peliculas-terror-mas-esperadas',
    title: 'El regreso del terror: Las películas más esperadas',
    excerpt: 'Desde secuelas de franquicias famosas hasta nuevas IPs que prometen no dejarnos dormir. Esto es lo que viene...',
    date: '10 de noviembre de 2025',
    author: 'Admin ClicTimes',
    imageUrl: 'https://placehold.co/600x400/E84346/F2F3F4?text=Terror'
  },
  {
    slug: 'guia-plataformas-streaming',
    title: 'Guía Definitiva: ¿Qué plataforma de streaming vale la pena en 2025?',
    excerpt: 'Max, Netflix, Prime Video, Disney+... Analizamos el catálogo, precio y estrenos de cada una para ayudarte a decidir.',
    date: '8 de noviembre de 2025',
    author: 'Admin ClicTimes',
    imageUrl: 'https://placehold.co/600x400/12A4E9/F2F3F4?text=Guia'
  },
  {
    slug: 'proximos-estrenos-cine-vs-streaming',
    title: 'La batalla continúa: Próximos estrenos, ¿Cine o Streaming?',
    excerpt: 'Analizamos la tendencia de los grandes estudios. ¿Están volviendo a la exclusividad en cines o la ventana es cosa del pasado?',
    date: '5 de noviembre de 2025',
    author: 'Admin ClicTimes',
    imageUrl: 'https://placehold.co/600x400/000165/F2F3F4?text=Cine'
  },
];

function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <BookOpen size={48} className="mx-auto text-brand-t450 mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-default mb-3">
          Blog de ClicTimes
        </h1>
        <p className="text-lg text-subtle">
          Noticias, análisis y artículos sobre el mundo del cine y las series.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group border border-gray-t900"
          >
            <div className="h-48 w-full overflow-hidden bg-strong">
              <img
                src={post.imageUrl}
                alt={`Imagen para ${post.title}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-xs font-medium text-subtle mb-2">{post.date}</span>
              <h2 className="text-xl font-bold text-default mb-3">
                {post.title}
              </h2>
              <p className="text-subtle text-sm mb-4 flex-grow">
                {post.excerpt}
              </p>
              <Link
                to={`/app/blog/${post.slug}`}
                className="font-medium text-brand-t450 hover:text-brand-t400 transition-colors duration-200 self-start"
              >
                Leer más &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;