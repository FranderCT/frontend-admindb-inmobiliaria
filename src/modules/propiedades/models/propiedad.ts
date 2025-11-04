import { Client } from "@/modules/clientes/models/client";

export interface Propiedad {
  idPropiedad: number;
  ubicacion: string;
  precio: number;
  estadoPropiedad: PropertyStatus;
  tipoInmueble: PropertyType;
  cliente: Client
  amueblado: boolean; 
  cantHabitaciones: number; 
  cantBannios: number; 
  areaM2: number;
  imagenUrl:string;
}

export interface PropertyType {
  idTipoInmueble: number;
  nombre: string;
}

export interface PropertyStatus {
  idEstadoPropiedad: number;
  nombre: string;
}

export interface CreateProperty {
  ubicacion: string;
  precio: string;
  idEstado: number;
  identificacion: number;
  idTipoInmueble: number;
  amueblado: boolean;
  cantHabitaciones: number;
  cantBannios: number;
  areaM2: number;
}

export interface CreatePropertyPayload {
  property: CreateProperty;
  file: File; 
}
export interface CreatePropertyType {
  nombre: string;
}
export interface CreatePropertyStatus {
  nombre: string;
}

export interface PropertyStatus {
  idEstadoPropiedad: number;
  nombre: string;
}

export interface PropertyType {
  idTipoInmueble: number;
  nombre: string;
}

export type PropertysPaginateParams = {
  page?: number;
  limit?: number;
  sortCol?: "idPropiedad" | "ubicacion" | "precio" | "estadoPropiedad" | "tipoInmueble";
  sortDir?: "ASC" | "DESC";
  q?: string;
  estado?: 0 | 1;
  estadoPropiedadId?: number;
  tipoInmuebleId?: number;
};

export interface UpdateProperty{
  idPropiedad: number,
  ubicacion?: string,
  precio?: number,
  idEstado?: number,
  idTipoInmueble?: number,
}