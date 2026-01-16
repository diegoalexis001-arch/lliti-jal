
import React from 'react';
import { Header, Footer } from '../components/Layout';

export const Security: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-10 text-center">Nuestra Fortaleza: Su Seguridad</h1>
          <p className="text-xl text-slate-500 mb-16 text-center leading-relaxed">
            Liti-jal fue construido desde el código base bajo el paradigma "Security by Design". No es un añadido, es nuestra esencia.
          </p>
          
          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Cifrado Militar de Datos</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Tanto en reposo (AES-256) como en tránsito (TLS 1.3), su información está protegida contra cualquier acceso no autorizado.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 font-medium">
                  <li>• Rotación semanal de llaves criptográficas</li>
                  <li>• Aislamiento total por base de datos (según plan)</li>
                  <li>• Cifrado de documentos a nivel objeto</li>
                </ul>
              </div>
              <div className="bg-slate-900 rounded-3xl p-10 flex items-center justify-center text-7xl">
                🛡️
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-indigo-600 rounded-3xl p-10 flex items-center justify-center text-7xl order-2 md:order-1 text-white">
                📋
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-4">Cumplimiento & Gobernanza</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Cumplimos con las regulaciones de protección de datos personales más estrictas de Latinoamérica, incluyendo la LFPDPPP en México.
                </p>
                <ul className="space-y-2 text-sm text-slate-500 font-medium">
                  <li>• Bitácora de acceso inalterable (Immutable Logs)</li>
                  <li>• Soporte para SOC2 Tipo II (en proceso)</li>
                  <li>• Gestión de consentimiento para el uso de IA</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
