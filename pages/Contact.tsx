
import React from 'react';
import { Header, Footer } from '../components/Layout';
import { Button } from '../components/Button';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <div>
            <h1 className="text-5xl font-bold mb-8">Hablemos de su futuro digital.</h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">
              Nuestro equipo de consultores legales y tecnológicos está listo para ayudarle a diseñar la estrategia de digitalización ideal para su firma.
            </p>
            <div className="space-y-8">
              <div className="flex gap-6">
                 <div className="text-2xl">🏢</div>
                 <div>
                   <h4 className="font-bold">Oficina Central</h4>
                   <p className="text-slate-500 text-sm">Av. Paseo de la Reforma, CDMX, México.</p>
                 </div>
              </div>
              <div className="flex gap-6">
                 <div className="text-2xl">📧</div>
                 <div>
                   <h4 className="font-bold">Email</h4>
                   <p className="text-slate-500 text-sm">contacto@liti-jal.mx</p>
                 </div>
              </div>
              <div className="flex gap-6">
                 <div className="text-2xl">📞</div>
                 <div>
                   <h4 className="font-bold">Teléfono</h4>
                   <p className="text-slate-500 text-sm">+52 (55) 4321-9876</p>
                 </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nombre</label>
                  <input type="text" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Firma / Empresa</label>
                  <input type="text" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Lexington SC" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Corporativo</label>
                <input type="email" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="juan@firma.mx" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Mensaje</label>
                <textarea className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none" placeholder="¿En qué podemos ayudarle?"></textarea>
              </div>
              <Button size="lg" fullWidth>Enviar Mensaje</Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
