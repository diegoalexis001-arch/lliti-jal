
import React, { useState } from 'react';
import { NAV_LINKS, ICONS } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#/" className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">LJ</div>
          Liti-jal
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a 
              key={link.path} 
              href={`#${link.path}`} 
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#/app" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
            Dashboard Demo
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ICONS.X /> : <ICONS.Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {NAV_LINKS.map(link => (
            <a 
              key={link.path} 
              href={`#${link.path}`} 
              className="text-lg font-medium text-slate-600"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a href="#/app" className="bg-indigo-600 text-white px-5 py-3 rounded-lg text-center font-semibold">
            Probar Demo
          </a>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <a href="#/" className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">LJ</div>
            Liti-jal
          </a>
          <p className="text-slate-500 text-sm leading-relaxed">
            Legal-tech premium diseñada para elevar la práctica jurídica en LATAM. Innovación, seguridad y cumplimiento en un solo lugar.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Producto</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Características</a></li>
            <li><a href="#/pricing" className="hover:text-indigo-600 transition-colors">Precios</a></li>
            <li><a href="#/security" className="hover:text-indigo-600 transition-colors">Seguridad</a></li>
            <li><a href="#/app" className="hover:text-indigo-600 transition-colors">Demo Interactiva</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Compañía</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#/blog" className="hover:text-indigo-600 transition-colors">Blog Legal</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Sobre Nosotros</a></li>
            <li><a href="#/contact" className="hover:text-indigo-600 transition-colors">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Términos de Servicio</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Compliance</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
        <div>© 2024 Liti-jal S.A.S. Todos los derechos reservados. Hecho en México.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600">LinkedIn</a>
          <a href="#" className="hover:text-slate-600">Twitter</a>
          <a href="#" className="hover:text-slate-600">Instagram</a>
        </div>
      </div>
    </footer>
  );
};
