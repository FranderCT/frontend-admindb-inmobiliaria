import { ReactNode } from "react";
import { AgentPreview, Contract } from "../models/contract"

export type CardContractProps = {
  contract: Contract,
  onEdit?: () => void
}

export type RawAgent = { id: number; nombre: string };

export const normalize = (data: RawAgent | RawAgent[] | null | undefined): AgentPreview[] => {
  const arr = Array.isArray(data) ? data : data ? [data] : [];
  return arr.map(a => ({
    identificacion: Number(a.id),
    nombre: a.nombre,
    nombreCompleto: a.nombre,
  }));
};

export type ContractDetailProps = {
  contractID: number;
};

export type DialogContractDetailProps = {
  trigger: ReactNode
  idContrato: number
  open?: boolean
  onOpenChange?: (v: boolean) => void
}
export type EditContractProps = {
  initial: {
    idContrato: number;
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
  };
  onSuccess?: () => void; 
};

export type FormEditContractProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: {
    idContrato: number
    fechaInicio?: string
    fechaFin?: string
    fechaFirma?: string
    fechaPago?: string
    idTipoContrato?: number
    idPropiedad?: number
    idAgente?: number
    montoTotal?: number
    deposito?: number
    porcentajeComision?: number
    estado?: string | null
    condiciones?: string[]
  }
}




export type FormAsignClientContractProps = {
  idContrato: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export type ClientContractRow = { identificacion?: number; idRol?: number; };