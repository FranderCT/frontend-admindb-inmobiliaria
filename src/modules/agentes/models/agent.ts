export interface Agent {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  estado: boolean; 
}

export interface CreateAgent {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
}
export interface UpdateAgent {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  estado: boolean;
}
export interface AgentesPaginateParams {
  page?: number;
  limit?: number;
  sortCol?: "identificacion" | "nombre" | "apellido1" | "telefono" | "estado";
  sortDir?: "ASC" | "DESC";
  q?: string;
  estado?: 0 | 1;
}

export interface AgentSearchPreview {
  identificacion: number;
  nombreCompleto?: string;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
}