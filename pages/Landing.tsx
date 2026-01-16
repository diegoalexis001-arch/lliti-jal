
import React from 'react';
import { Header, Footer } from '../components/Layout';
import { Button } from '../components/Button';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { FEATURES, ICONS } from '../constants';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-6 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-700">
            Nueva Era: Gestión Judicial con IA Ética
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Eleve su práctica jurídica <br className="hidden md:block" /> con precisión quirúrgica.
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in duration-1000">
            Liti-jal es la plataforma SaaS premium que centraliza sus expedientes, automatiza tareas y ofrece reportes accionables para los equipos legales más exigentes de LATAM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-in fade-in duration-1000">
            <Button size="lg" className="px-10" onClick={() => window.location.hash = '/app'}>Probar Demo</Button>
            <Button size="lg" variant="outline" className="px-10" onClick={() => window.location.hash = '/contact'}>Agendar Llamada</Button>
          </div>
          
          <InteractiveDemo />
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-10">Con la confianza de firmas líderes</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 grayscale opacity-50">
            {['LEXOR', 'GLOBAL LEGAL', 'MX ADVOCATES', 'SOUTH COUNSEL', 'ELITE JURIS'].map(logo => (
              <div key={logo} className="flex items-center justify-center font-black text-2xl tracking-tighter text-slate-900">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Control total en 3 pasos</h2>
            <p className="text-slate-500">Diseñado para ser intuitivo desde el primer minuto.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Importación Inteligente', desc: 'Centralice sus expedientes físicos o digitales en segundos.' },
              { step: '02', title: 'Automatización de Plazos', desc: 'Nuestro motor calcula términos procesales automáticamente.' },
              { step: '03', title: 'Colaboración en Tiempo Real', desc: 'Gestione a su equipo con asignación de tareas y auditoría.' },
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="text-4xl font-black text-slate-100 mb-6 group-hover:text-indigo-100 transition-colors">{item.step}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-32 px-6 bg-slate-900 text-white rounded-[3rem] mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Un ecosistema completo</h2>
            <p className="text-slate-400">Todo lo que su firma necesita para escalar sin fricciones.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h4 className="font-bold mb-2">{f.title}</h4>
                <p className="text-slate-400 text-xs leading-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mexico Mercantil Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded mb-4">ESPECIALIZADO: MÉXICO MERCANTIL</div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Timeline del juicio mercantil automatizado</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Entendemos la procesal mexicana. Nuestra plataforma genera alertas automáticas por cada etapa del juicio, desde la demanda hasta la ejecución de sentencia.
              </p>
              <ul className="space-y-4">
                {['Demanda y Radicación', 'Emplazamiento y Contestación', 'Periodo de Pruebas', 'Alegatos y Sentencia'].map((step, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
               <div className="absolute top-4 right-4 animate-pulse">
                 <div className="bg-red-500 h-3 w-3 rounded-full"></div>
               </div>
               <div className="space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="font-bold">Estatus Procesal</span>
                    <span className="text-indigo-600 font-semibold text-sm">Juicio 123/2024</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-0.5 bg-indigo-200 relative">
                        <div className="absolute -left-1 top-0 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                      </div>
                      <div>
                        <div className="text-sm font-bold">Pruebas Ofrecidas</div>
                        <div className="text-xs text-slate-400">10 May 2024 - 10:00 AM</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-0.5 bg-indigo-200 relative">
                        <div className="absolute -left-1 top-0 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      </div>
                      <div className="opacity-50">
                        <div className="text-sm font-bold">Admisión de Pruebas</div>
                        <div className="text-xs text-slate-400">Pendiente de acuerdo</div>
                      </div>
                    </div>
                 </div>
                 <div className="bg-indigo-600 text-white p-4 rounded-xl text-xs font-medium">
                    PRÓXIMA ALERTA: Término de 3 días para desahogo.
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* IA & Government */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">IA con Gobernanza y Ética</h2>
            <p className="text-slate-500">La inteligencia artificial no debe ser una "caja negra". En Liti-jal priorizamos el control humano y la seguridad de datos sensibles.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Revisión Humana', desc: 'Todo borrador generado por IA requiere validación obligatoria por un abogado.' },
              { title: 'Permisos RBAC', desc: 'Usted decide quién puede interactuar con el motor de IA.' },
              { title: 'Bitácora de Prompts', desc: 'Registro histórico de cada interacción para fines de auditoría.' },
              { title: 'Aislamiento de Datos', desc: 'Sus datos sensibles jamás se usan para entrenar modelos globales.' },
            ].map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3">{card.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Summary */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Seguridad de Grado Bancario</h2>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="font-bold mb-2">TLS 1.3</div>
                  <div className="text-indigo-200 text-sm">Cifrado de tránsito</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Aislamiento</div>
                  <div className="text-indigo-200 text-sm">Multi-tenant seguro</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Backups</div>
                  <div className="text-indigo-200 text-sm">Cada 15 minutos</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Compliance</div>
                  <div className="text-indigo-200 text-sm">Protección de Datos</div>
                </div>
              </div>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => window.location.hash = '/security'}>Explorar Infraestructura</Button>
            </div>
            <div className="hidden md:flex justify-center">
               <div className="w-64 h-64 border-8 border-indigo-500/30 rounded-full flex items-center justify-center">
                 <div className="w-48 h-48 border-4 border-indigo-400/50 rounded-full flex items-center justify-center">
                    <div className="text-6xl">🔒</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20">Resultados que hablan</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { quote: "Liti-jal transformó nuestra operación. Redujimos un 30% el tiempo de reporte a clientes.", author: "Lic. Andrea Meza", role: "Socia, Meza & Asociados", metric: "+30% Eficiencia" },
              { quote: "La mejor interfaz que he visto en una herramienta legal. Simple y potente.", author: "Dr. Roberto Silva", role: "Litigante Independiente", metric: "-50% Errores" },
              { quote: "El soporte técnico y la seguridad nos dieron la confianza para migrar 1,500 expedientes.", author: "Carlos Ruiz", role: "Gerente Legal, CorpMX", metric: "1,500+ Casos" },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-indigo-600 font-black text-xs uppercase mb-4 tracking-widest">{t.metric}</div>
                  <p className="text-lg text-slate-700 italic mb-8">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i+10}/100`} alt="user" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{t.author}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: "¿Es fácil migrar mis datos actuales?", a: "Sí, ofrecemos herramientas de importación masiva vía Excel y CSV, además de servicios de migración asistida." },
              { q: "¿Tienen alertas de boletín judicial?", a: "Contamos con integración para los principales tribunales de México y estamos expandiendo a LATAM." },
              { q: "¿Cuántos usuarios pueden usar la plataforma?", a: "Depende de su plan, pero nuestra arquitectura soporta desde abogados independientes hasta firmas de 500+ integrantes." },
              { q: "¿La IA toma decisiones por mí?", a: "Absolutamente no. Nuestra IA es un asistente de apoyo; todas las acciones críticas requieren validación humana." },
              { q: "¿Ofrecen capacitación?", a: "Sí, todos nuestros planes incluyen sesiones de onboarding y acceso a nuestra academia digital." },
              { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, nuestros planes mensuales son sin compromiso de permanencia a largo plazo." },
              { q: "¿Dónde se hospedan mis datos?", a: "Utilizamos servidores de Google Cloud Platform y AWS con regiones configurables para cumplimiento local." },
              { q: "¿Tienen app móvil?", a: "Contamos con una web-app responsiva optimizada y apps nativas en desarrollo." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="p-6 cursor-pointer font-bold text-slate-900 flex justify-between items-center list-none">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Empiece hoy a modernizar su despacho.</h2>
          <p className="text-xl text-slate-500 mb-12">Únase a los equipos legales que ya están ganando ventaja competitiva.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="px-12" onClick={() => window.location.hash = '/app'}>Probar Demo Ahora</Button>
             <Button size="lg" variant="outline" className="px-12" onClick={() => window.location.hash = '/contact'}>Hablar con un Experto</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
