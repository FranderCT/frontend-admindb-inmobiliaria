import { ReactNode } from "react"
import { Client, CreateClient } from "../models/client"

export type ClientCardProps = { 
    client: Client
}

export type DialogClienteProps = {
    from?: 'top' | 'right' | 'bottom' | 'left'
    trigger: ReactNode,
    client: Client
}


export type CreateClientProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (c: CreateClient) => void;
};


export const initialValuesClient: CreateClient = {
  identificacion: 0,
  nombre: "",
  apellido1: "",
  apellido2: "",
  telefono: "",
};