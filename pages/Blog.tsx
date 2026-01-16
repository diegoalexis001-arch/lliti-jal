
import React from 'react';
import { Header, Footer } from '../components/Layout';
import { BLOG_MOCK } from '../constants';

export const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-6">Perspectivas Legales</h1>
            <p className="text-slate-500">Manténgase al día con la evolución del derecho y la tecnología.</p>
          </div>
          <div className="grid gap-12">
            {BLOG_MOCK.map(post => (
              <div key={post.id} className="group cursor-pointer">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-64 h-48 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                     <img src={`https://picsum.photos/seed/${post.id}/500/350`} alt="blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                       <span>{post.categoria}</span>
                       <span className="text-slate-300">•</span>
                       <span className="text-slate-400">{post.fecha}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{post.titulo}</h2>
                    <p className="text-slate-500 leading-relaxed text-lg mb-6">{post.excerpt}</p>
                    <button className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:gap-4 transition-all">Leer más <span>→</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
