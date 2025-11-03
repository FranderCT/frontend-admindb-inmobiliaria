export interface CreateContract {
  idContrato?: number;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  fechaFirma?: string | null;
  fechaPago?: string | null;
  idTipoContrato: number;
  idPropiedad: number;
  idAgente: number;
  montoTotal: number;
  deposito: number;
  cantidadPagos?: number;
  porcentajeComision: number;
  estado: null;
  condiciones: string[];
}

export interface Contract {
  idContrato: number,
  fechaInicio: string,
  fechaFin: string,
  fechaFirma: string,
  fechaPago: string,
  idTipoContrato: number,
  TipoContrato: string,
  idPropiedad: number,
  Propiedad: string,
  idAgente: number,
  NombreAgente: string,
  ApellidoAgente: string,
  estado: string,
  condiciones: [
    {
      idCondicion: number,
      textoCondicion: string
    }
  ]
}

export interface ContractProperty {
  idPropiedad: number,
  ubicacion: string,
  precio: number,
  idEstadoPropiedad: number,
  nombreEstadoPropiedad: string,
  idTipoInmueble: number,
  nombreTipoInmueble: string,
}

export interface ContractParticipants {
  identificacion: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  idRol: number;
  rol: string;
}
export interface ContractParticipant {
  idClienteContrato: number
  idContrato: number
  identificacion: number
  nombreCliente: string
  rol: string
}

export interface ContractDetails {
  idContrato: number,
  fechaInicio: string,
  fechaFin: string,
  cantidadPagos: number,
  fechaFirma: string,
  fechaPago: string,
  tipoContrato: string,
  idPropiedad: number,
  idAgente: number,
  montoTotal: number,
  deposito: number,
  porcentajeComision: number,
  estado: string,
  propiedad: ContractProperty
  participantes: ContractParticipants[]
  condiciones: [
    {
      idCondicion: number,
      textoCondicion: string
    }
  ]
}

export type AgentPreview = {
  identificacion: number;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  nombreCompleto?: string;
};
export interface RoleType {
  idRol: number;
  nombre: string;
}
export interface ContractType {
  idTipoContrato: number;
  nombre: string;
}
export interface ContractParticipantsPayload {
  participantes: Array<{
    identificacion: number;
    idRol: number;
    idContrato: number;
  }>;
}

export interface AvailableProperty {
  idPropiedad: number;
  ubicacion: string;
}

export interface UpdateContract {
  idContrato: number;
  cantidadPagos?: number;
  fechaInicio?: string;
  fechaFin?: string;
  fechaFirma?: string;
  fechaPago?: string;
  idTipoContrato?: number;
  idPropiedad?: number;
  idAgente?: number;
  montoTotal?: number;
  deposito?: number;
  porcentajeComision?: number;
  estado?: string | null;
  condiciones?: string[];
}

export type EstadoContrato = "Pendiente" | "Activo" | "Finalizado";

export type ContractsPaginateParams = {
  page?: number;   
  limit?: number;  
  sortCol?: "fechaInicio" | "fechaFin" | "fechaFirma" | "montoTotal"; 
  sortDir?: "ASC" | "DESC"; 
  q?: string;              
  estado?: EstadoContrato;
  tipoContratoId?: number;
  agenteId?: number | string;
};

export type PaginationMeta = {
  page: number;
  pageCount: number;
  total: number;
  limit: number;
};

export type ContractsPaginateResponse = {
  data: Contract[];
  meta: PaginationMeta;
};

export type ContratosFilters = Required<Pick<
  ContractsPaginateParams,
  "page" | "limit" | "sortCol" | "sortDir"
>> & Omit<ContractsPaginateParams, "page" | "limit" | "sortCol" | "sortDir">;