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