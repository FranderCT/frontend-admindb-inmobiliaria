import { ReactNode } from "react"
import { Agent } from "../models/agent"


export type AgentCardProps = { 
    agent: Agent
}

export type DialogAgenteProps = {
    from?: 'top' | 'right' | 'bottom' | 'left'
    trigger: ReactNode,
    agent: Agent
}