export interface CreateContract {
  fechaInicio: string;
  fechaFin: string;
  fechaFirma: string;
  fechaPago: string;
  idTipoContrato: number;
  idPropiedad: number;
  idAgente: number;
  condiciones: string[];
}

export interface Contract{
    idContrato: number,
    fechaInicio: string,
    fechaFin: string,
    fechaFirma: string,
    fechaPago: string,
    TipoContrato: string,
    Propiedad: string,
    NombreAgente: string,
    ApellidoAgente: string,
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