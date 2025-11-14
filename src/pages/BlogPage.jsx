import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
// --- ¡CORRECCIÓN AQUÍ! ---
// La importación debe terminar en .jsx
import { blogPosts } from './blogData.jsx';

function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <BookOpen size={32} className="text-action-primary mr-3" />
        <h1 className="text-3xl md:text-4xl font-bold text-default">
          Blog de ClicTimes
        </h1>
      </div>

      <p className="text-lg text-subtle mb-10">
        Noticias, análisis y artículos sobre el mundo del cine y las series.
      </p>

      {/* Contenedor de artículos (Ahora dinámico) */}
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article 
            key={post.slug} 
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden border border-gray-t900 transition-shadow hover:shadow-lg"
          >
            {/* Imagen */}
            <div className="w-full md:w-1/3 h-48 md:h-auto">
              <img
                src={post.imageUrl}
                alt={`Imagen para ${post.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Contenido */}
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-subtle mb-1">{post.date}</p>
                <h2 className="text-2xl font-bold text-default mb-3 hover:text-action-primary">
                  <Link to={`/app/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-subtle mb-4">
                  {post.summary}
                </p>
              </div>
              <Link 
                to={`/app/blog/${post.slug}`} 
                className="inline-flex items-center font-medium text-brand-t450 hover:text-brand-t400 transition-colors self-start"
              >
                Leer más
                <ArrowRight size={18} className="ml-1.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;