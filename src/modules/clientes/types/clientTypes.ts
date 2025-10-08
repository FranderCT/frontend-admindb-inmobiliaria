import { ComponentProps, ReactNode } from "react"
import { Client, CreateClient } from "../models/client"
import { DialogPanel } from "node_modules/@headlessui/react/dist/components/dialog/dialog"

export type ClientCardProps = { 
    client: Client
}

export type HistorialClienteProps = {
    from?: 'top' | 'right' | 'bottom' | 'left'
  trigger: ReactNode
  client: Client
  identificacion: string
}


export type CreateClientProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (c: CreateClient) => void;
};


export const initialValuesClient: CreateClient = {
  identificacion: "",
  nombre: "",
  apellido1: "",
  apellido2: "",
  telefono: "",
};


export type EditClienteDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  from?: ComponentProps<typeof DialogPanel>["from"];
  showCloseButton?: boolean;
  cliente: {
    identificacion: number | string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    telefono: string;
    estado: boolean;
  };
};


export type ClientesPaginateParams = {
  page?: number
  limit?: number
  sortCol?: string
  sortDir?: 'ASC' | 'DESC'
  q?: string
  estado?: 0 | 1
}

export type ClientesPaginateResponse = {
    data: Client[]
    meta: {
        total: number
        page: number
        limit: number
        pageCount: number
    }
}
