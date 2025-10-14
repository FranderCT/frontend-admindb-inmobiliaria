import { ComponentProps, ReactNode } from "react"
import { DialogPanel } from "node_modules/@headlessui/react/dist/components/dialog/dialog"
import { Agent, CreateAgent } from "../models/agent"

export type AgentCardProps = { 
    agent: Agent
}

export type HistorialAgenteProps = {
    from?: 'top' | 'right' | 'bottom' | 'left'
  trigger: ReactNode
  agent: Agent
  identificacion: string
}


export type CreateAgentProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (c: CreateAgent) => void;
};


export const initialValuesAgent: CreateAgent = {
  identificacion: "",
  nombre: "",
  apellido1: "",
  apellido2: "",
  telefono: "",
};


export type EditAgenteDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  from?: ComponentProps<typeof DialogPanel>["from"];
  showCloseButton?: boolean;
  agente: {
    identificacion: number | string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    estado: boolean;
  };
};


export type AgentesPaginateParams = {
  page?: number
  limit?: number
  sortCol?: string
  sortDir?: 'ASC' | 'DESC'
  q?: string
  estado?: 0 | 1
}

export type AgentesPaginateResponse = {
    data: Agent[]
    meta: {
        total: number
        page: number
        limit: number
        pageCount: number
    }
}
