import { ReactNode } from "react";

export type SortDir = "ASC" | "DESC";

export type PropiedadesFilters = {
  page: number;
  limit: number;
  sortCol: "idPropiedad" | "ubicacion" | "precio" | "estadoPropiedad" | "tipoInmueble";
  sortDir: SortDir;
  q: string;
  estado?: 0 | 1;
  estadoPropiedadId?: number; // catálogo: Disponible, Reservada, etc.
  tipoInmuebleId?: number;    // catálogo: Casa, Apto, etc.
};

export const defaultFilters: PropiedadesFilters = {
  page: 1,
  limit: 9,
  sortCol: "idPropiedad",
  sortDir: "ASC",
  q: "",
  estado: undefined,
  estadoPropiedadId: undefined,
  tipoInmuebleId: undefined,
};

export type PropiedadesProviderType = {
  children: ReactNode;
};