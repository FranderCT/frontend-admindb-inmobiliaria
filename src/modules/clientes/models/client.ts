export interface Client {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  estado: boolean; 
}

export interface CreateClient {
  identificacion: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
}
export interface UpdateClient {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  estado: boolean;
}
export interface ClientesPaginateParams {
  page?: number;
  limit?: number;
  sortCol?: "identificacion" | "nombre" | "apellido1" | "telefono" | "estado";
  sortDir?: "ASC" | "DESC";
  q?: string;
  estado?: 0 | 1;
}

export interface ClientSearchPreview {
  identificacion: number;
  nombreCompleto?: string;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
}