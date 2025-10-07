import { ReactNode } from "react"
import { Client } from "../models/client"

export type ClientCardProps = { 
    client: Client
}

export type DialogClienteProps = {
    from?: 'top' | 'right' | 'bottom' | 'left'
    trigger: ReactNode,
    client: Client
}