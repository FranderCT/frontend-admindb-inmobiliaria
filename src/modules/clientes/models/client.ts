export interface Client {
  identificacion: number;
  nombreCompleto: string;
  telefono: string;
  estado: boolean; 
}

export interface CreateClient {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
}