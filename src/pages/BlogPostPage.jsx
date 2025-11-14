import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from './blogData.jsx';

function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold text-critical mb-4">Error 404</h1>
        {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
        <p className="text-lg text-text-subtle mb-6">
          El artículo que buscas no existe o fue movido.
        </p>
        <Link
          to="/app/blog"
          className="inline-flex items-center text-brand-t450 font-medium hover:text-brand-t400 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1.5" />
          Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/app/blog"
        className="inline-flex items-center text-brand-t450 font-medium mb-6 hover:text-brand-t400 transition-colors"
      >
        <ArrowLeft size={18} className="mr-1.5" />
        Volver al Blog
      </Link>

      {/* --- ¡MODIFICACIÓN! Fondo y borde semánticos --- */}
      <article className="bg-white dark:bg-bg-muted p-8 md:p-10 rounded-lg shadow-md border border-border-default">
        {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-default mb-4">
          {post.title}
        </h1>
        {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
        <p className="text-text-subtle text-sm mb-6">
          Por {post.author} | Publicado el {post.date}
        </p>

        {/* --- ¡MODIFICACIÓN! Fondo semántico --- */}
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-bg-strong mb-8">
          <img
            src={post.imageUrl}
            alt={`Imagen para ${post.title}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- ¡MODIFICACIÓN! Texto semántico --- */}
        <div className="prose max-w-none text-text-subtle space-y-4">
          {post.content}
        </div>
      </article>
    </div>
  );
}

export default BlogPostPage;