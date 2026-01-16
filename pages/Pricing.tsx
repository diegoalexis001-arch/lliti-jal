
import React from 'react';
import { Header, Footer } from '../components/Layout';
import { Button } from '../components/Button';
import { ICONS } from '../constants';

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-6">Planes que crecen con usted</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Transparencia total. Sin costos ocultos. Elija la escala que necesite su equipo.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Esencial', price: '$49', features: ['Hasta 3 usuarios', '100 expedientes activos', 'Alertas básicas', 'Soporte vía email'] },
              { name: 'Profesional', price: '$149', features: ['Hasta 15 usuarios', 'Expedientes ilimitados', 'Asistente IA (Beta)', 'Timeline Judicial MX', 'Soporte prioritario'], popular: true },
              { name: 'Enterprise', price: 'Personalizado', features: ['Usuarios ilimitados', 'Auditoría avanzada', 'SLA garantizado', 'SSO & Seguridad avanzada', 'Manager dedicado'] },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-200'} flex flex-col`}>
                {plan.popular && <div className="text-indigo-600 text-xs font-bold uppercase mb-4 tracking-widest">Más Elegido</div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== 'Personalizado' && <span className="text-slate-400 font-medium">/mes</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="text-emerald-500"><ICONS.Check /></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth>{plan.name === 'Enterprise' ? 'Contactar Ventas' : 'Comenzar Ahora'}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
