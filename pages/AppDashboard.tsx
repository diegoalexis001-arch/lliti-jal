
import React, { useState } from 'react';
import { ICONS, EXPEDIENTES_MOCK, TAREAS_MOCK } from '../constants';
import { Button } from '../components/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AiLaboratory } from '../components/AiLaboratory';

const data = [
  { name: 'Lun', casos: 12, tareas: 20 },
  { name: 'Mar', casos: 15, tareas: 25 },
  { name: 'Mie', casos: 18, tareas: 15 },
  { name: 'Jue', casos: 14, tareas: 30 },
  { name: 'Vie', casos: 22, tareas: 28 },
];

export const Dashboard: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'expedientes' | 'tareas' | 'reportes' | 'ai'>('dashboard');
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col shrink-0">
        <div className="text-white font-bold text-xl flex items-center gap-2 mb-10">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-[10px]">LJ</div>
          Liti-jal
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'expedientes', label: 'Expedientes', icon: '📁' },
            { id: 'tareas', label: 'Tareas', icon: '✅' },
            { id: 'reportes', label: 'Reportes', icon: '📊' },
            { id: 'ai', label: 'Laboratorio IA', icon: '⚡' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === item.id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:text-white" onClick={() => setView('ai')}>
            <span>🤖</span> Asistente IA
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:text-white">
            <span>⚙️</span> Configuración
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{view === 'ai' ? 'Laboratorio IA' : view}</h1>
            <p className="text-slate-500 text-sm">Bienvenido de nuevo, Lic. García.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              <button className="p-2 text-slate-400 hover:text-slate-600"><ICONS.Bell /></button>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200">
               <img src="https://picsum.photos/seed/user1/100" className="rounded-full" alt="avatar" />
            </div>
          </div>
        </header>

        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Expedientes', value: '1,248', change: '+12%', icon: '📁' },
                { label: 'Tareas Pendientes', value: '42', change: '-5%', icon: '⏳' },
                { label: 'Vencimientos Hoy', value: '3', change: 'Urgente', icon: '⏰', urgent: true },
                { label: 'Horas Facturables', value: '124', change: '+18%', icon: '💰' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.urgent ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold mb-6 text-slate-700">Actividad Semanal</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="casos" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold mb-6 text-slate-700">Progreso de Tareas</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="tareas" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-700">Expedientes Recientes</h3>
                 <Button variant="ghost" size="sm" onClick={() => setView('expedientes')}>Ver todos</Button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-8 py-4">Número</th>
                        <th className="px-8 py-4">Partes</th>
                        <th className="px-8 py-4">Etapa</th>
                        <th className="px-8 py-4">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {EXPEDIENTES_MOCK.map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4 font-semibold text-slate-700">{ex.numero}</td>
                          <td className="px-8 py-4 text-slate-500">
                             <div className="font-medium text-slate-700">{ex.actor}</div>
                             <div className="text-xs">vs {ex.demandado}</div>
                          </td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">{ex.etapa}</span>
                          </td>
                          <td className="px-8 py-4">
                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                               {ex.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {view === 'expedientes' && (
          <div className="animate-in fade-in duration-500">
             <div className="flex gap-4 mb-8">
               <div className="relative flex-grow">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                   <ICONS.Search />
                 </div>
                 <input type="text" placeholder="Buscar por número, actor o demandado..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <Button>+ Nuevo Expediente</Button>
             </div>
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-8 py-4">Expediente</th>
                      <th className="px-8 py-4">Último Movimiento</th>
                      <th className="px-8 py-4">Actualizado</th>
                      <th className="px-8 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {EXPEDIENTES_MOCK.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-4">
                           <div className="font-bold text-slate-900">{ex.numero}</div>
                           <div className="text-xs text-slate-400">{ex.juicio}</div>
                        </td>
                        <td className="px-8 py-4 text-slate-600 max-w-xs truncate">{ex.ultimoMovimiento}</td>
                        <td className="px-8 py-4 text-slate-400">{ex.fechaActualizacion}</td>
                        <td className="px-8 py-4">
                          <Button variant="ghost" size="sm">Detalle</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {view === 'tareas' && (
          <div className="animate-in fade-in duration-500 grid md:grid-cols-3 gap-8">
            {['Pendiente', 'En Proceso', 'Terminada'].map(status => (
              <div key={status} className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest">{status}</h4>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {TAREAS_MOCK.filter(t => t.estado === status).length}
                  </span>
                </div>
                <div className="space-y-4">
                  {TAREAS_MOCK.filter(t => t.estado === status).map(tarea => (
                    <div key={tarea.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-3 ${tarea.prioridad === 'Alta' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        Prioridad {tarea.prioridad}
                      </div>
                      <h5 className="font-bold text-slate-800 mb-2">{tarea.titulo}</h5>
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">📅 {tarea.vencimiento}</span>
                        <span className="font-medium text-slate-600">{tarea.asignado}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs font-bold hover:border-slate-400 hover:text-slate-500 transition-all">+ Añadir Tarjeta</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'reportes' && (
          <div className="animate-in fade-in duration-500 flex items-center justify-center h-96 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <div className="text-center">
               <div className="text-4xl mb-4">📊</div>
               <p className="font-bold">Generando Visualizaciones de KPI</p>
               <p className="text-sm">Personalice sus reportes en la versión completa.</p>
            </div>
          </div>
        )}

        {view === 'ai' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AiLaboratory />
          </div>
        )}
      </main>
    </div>
  );
};
