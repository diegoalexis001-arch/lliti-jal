
export interface Expediente {
  id: string;
  numero: string;
  actor: string;
  demandado: string;
  juicio: string;
  estado: string;
  etapa: 'Inicial' | 'Pruebas' | 'Alegatos' | 'Sentencia' | 'Ejecución';
  ultimoMovimiento: string;
  fechaActualizacion: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  vencimiento: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'En Proceso' | 'Terminada';
  asignado: string;
}

export interface Alerta {
  id: string;
  mensaje: string;
  tipo: 'urgente' | 'aviso' | 'informativo';
  fecha: string;
}

export interface BlogItem {
  id: string;
  titulo: string;
  fecha: string;
  excerpt: string;
  categoria: string;
}
