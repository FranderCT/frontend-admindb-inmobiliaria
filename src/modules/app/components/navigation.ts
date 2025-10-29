import { Home, Users, FileText, Receipt, Building2, BarChart3 } from "lucide-react";
import type { Role } from "@/modules/seguridad/utils/auth"

export const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: Home, allowed: ["AGENTE", "ADMINISTRADOR", "LECTOR"] },
    { name: 'Agentes', href: '/agentes', icon: Users, allowed: ["ADMINISTRADOR"] },
    { name: 'Clientes', href: '/clientes', icon: Users, allowed: ["AGENTE", "ADMINISTRADOR"] },
    { name: 'Contratos', href: '/contratos', icon: FileText, allowed: ["AGENTE", "ADMINISTRADOR"] },
    { name: 'Facturación', href: '/facturacion', icon: Receipt, allowed: ["AGENTE", "ADMINISTRADOR"] },
    { name: 'Propiedades', href: '/propiedades', icon: Building2, allowed: ["AGENTE", "ADMINISTRADOR"] },
    { name: 'Estadísticas', href: '/statistics/', icon: BarChart3, allowed: ["LECTOR", "ADMINISTRADOR"] },
]

export type NavItem = {
  name: string
  href: string
  icon: React.ComponentType
  allowed?: Role[]
}