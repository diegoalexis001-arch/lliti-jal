
import React from 'react';
import { Expediente, Tarea, BlogItem } from './types';

export const EXPEDIENTES_MOCK: Expediente[] = [
  { id: '1', numero: '123/2024', actor: 'Banco Global S.A.', demandado: 'Constructora Beta', juicio: 'Ejecutivo Mercantil', estado: 'Activo', etapa: 'Pruebas', ultimoMovimiento: 'Auto de recepción de pruebas', fechaActualizacion: '2024-05-10' },
  { id: '2', numero: '456/2023', actor: 'Logística Delta', demandado: 'Retail México', juicio: 'Ordinario Civil', estado: 'Suspendido', etapa: 'Inicial', ultimoMovimiento: 'Notificación por estrados', fechaActualizacion: '2024-05-08' },
  { id: '3', numero: '789/2024', actor: 'Financiera Norte', demandado: 'Individual J.P.', juicio: 'Hipotecario', estado: 'Activo', etapa: 'Sentencia', ultimoMovimiento: 'Turnado para sentencia', fechaActualizacion: '2024-05-12' },
];

export const TAREAS_MOCK: Tarea[] = [
  { id: 't1', titulo: 'Preparar alegatos 123/2024', vencimiento: '2024-05-20', prioridad: 'Alta', estado: 'En Proceso', asignado: 'Lic. García' },
  { id: 't2', titulo: 'Revisar notificaciones boletín', vencimiento: '2024-05-15', prioridad: 'Media', estado: 'Pendiente', asignado: 'Lic. Ruiz' },
  { id: 't3', titulo: 'Entrevista con cliente Delta', vencimiento: '2024-05-14', prioridad: 'Baja', estado: 'Terminada', asignado: 'Lic. García' },
];

export const BLOG_MOCK: BlogItem[] = [
  { id: 'b1', titulo: 'Reformas al Código de Comercio 2024', fecha: '12 May 2024', excerpt: 'Análisis profundo sobre los cambios en la justicia digital mercantil en México.', categoria: 'Legal' },
  { id: 'b2', titulo: 'La IA en la práctica jurídica ética', fecha: '08 May 2024', excerpt: 'Cómo implementar inteligencia artificial sin comprometer la confidencialidad.', categoria: 'Tecnología' },
];

export const NAV_LINKS = [
  { name: 'Inicio', path: '/' },
  { name: 'Precios', path: '/pricing' },
  { name: 'Seguridad', path: '/security' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contacto', path: '/contact' },
];

export const FEATURES = [
  { title: 'Expedientes', desc: 'Control total de documentos y plazos judiciales.', icon: '📁' },
  { title: 'Tareas', desc: 'Gestión ágil para equipos de alto rendimiento.', icon: '✅' },
  { title: 'Vencimientos', desc: 'Alertas automáticas para no perder ningún término.', icon: '⏰' },
  { title: 'Documentos', desc: 'Repositorio centralizado con búsqueda inteligente.', icon: '📄' },
  { title: 'Clientes', desc: 'Historial completo y comunicación simplificada.', icon: '👤' },
  { title: 'Facturación', desc: 'Control de honorarios y gastos procesales.', icon: '💰' },
  { title: 'Reportes', desc: 'Visualización de datos para toma de decisiones.', icon: '📊' },
  { title: 'Portal Cliente', desc: 'Acceso seguro para tus clientes 24/7.', icon: '🌐' },
  { title: 'Auditoría', desc: 'Bitácora completa de cada acción realizada.', icon: '🔍' },
  { title: 'Asistente IA', desc: 'Análisis y borradores con supervisión humana.', icon: '🤖' },
];

export const ICONS = {
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
};
