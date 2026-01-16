
import React, { useState } from 'react';
import { Button } from './Button';
import { ICONS } from '../constants';

export const InteractiveDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [expediente, setExpediente] = useState<string | null>(null);
  const [actuacion, setActuacion] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="text-xs font-semibold text-slate-400 tracking-widest uppercase">LITI-JAL CORE ENGINE</div>
        <div className="w-6"></div>
      </div>
      
      <div className="p-8 grid md:grid-cols-3 gap-8 min-h-[400px]">
        {/* Sidebar Mini */}
        <div className="space-y-4 border-r border-slate-100 pr-6 hidden md:block">
          <div className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${step === 0 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500'}`}>
            <span className="text-xl">📁</span> Expedientes
          </div>
          <div className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${step === 1 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500'}`}>
            <span className="text-xl">✍️</span> Actuaciones
          </div>
          <div className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${step === 2 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500'}`}>
            <span className="text-xl">📅</span> Agenda
          </div>
          <div className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${step === 3 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500'}`}>
            <span className="text-xl">📈</span> Reporte
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2 flex flex-col justify-center">
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold mb-2">Crear Expediente</h3>
              <p className="text-slate-500 mb-6">Inicia tu gestión centralizada en segundos.</p>
              <input 
                type="text" 
                placeholder="Ej: 542/2024 Mercantil"
                className="w-full p-3 rounded-lg border border-slate-200 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => setExpediente(e.target.value)}
              />
              <Button disabled={!expediente} onClick={() => setStep(1)} fullWidth>Siguiente: Agregar Actuación</Button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mb-2">
                <span>📁 {expediente}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Agregar Actuación</h3>
              <p className="text-slate-500 mb-6">Registra acuerdos, notificaciones o promociones.</p>
              <textarea 
                placeholder="Describe el movimiento judicial..."
                className="w-full p-3 rounded-lg border border-slate-200 mb-4 h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => setActuacion(e.target.value)}
              />
              <Button disabled={!actuacion} onClick={() => setStep(2)} fullWidth>Siguiente: Generar Tarea</Button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded mb-4 font-bold border border-amber-100">
                ALERTA: Vencimiento próximo detectado
              </div>
              <h3 className="text-xl font-bold mb-2">Crear Tarea con Vencimiento</h3>
              <p className="text-slate-500 mb-6">El sistema sugiere tareas basadas en la actuación.</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mb-6">
                <div>
                  <div className="font-semibold text-slate-700">Presentar Recurso</div>
                  <div className="text-sm text-slate-500 italic">Vence en 3 días hábiles</div>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
              <Button onClick={() => setStep(3)} fullWidth>Finalizar y Ver Reporte</Button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in zoom-in duration-500 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ICONS.Check />
              </div>
              <h3 className="text-xl font-bold mb-2">¡Gestión Exitosa!</h3>
              <p className="text-slate-500 mb-6">Has reducido el tiempo de procesamiento en un 40%.</p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Carga de Trabajo</div>
                  <div className="text-lg font-bold text-slate-700">Optimizada</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Riesgo de Omisión</div>
                  <div className="text-lg font-bold text-emerald-600">0%</div>
                </div>
              </div>
              <Button className="mt-8" variant="outline" onClick={() => setStep(0)}>Reiniciar Demo</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
