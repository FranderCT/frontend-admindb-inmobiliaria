import { Home, Users, FileText, Receipt, Building2, BarChart3 } from "lucide-react";

export const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Agentes', href: '/agentes', icon: Users },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Contratos', href: '/contratos', icon: FileText },
    { name: 'Facturación', href: '/facturacion', icon: Receipt },
    { name: 'Propiedades', href: '/propiedades', icon: Building2 },
    { name: 'Estadísticas', href: '/statistics', icon: BarChart3 },
]