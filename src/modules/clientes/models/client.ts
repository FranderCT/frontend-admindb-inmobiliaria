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
