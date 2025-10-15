import TileCard from '@/components/TileCard'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, Building2, FileText, Receipt, Users } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})
const tiles = [
  {
    to: '/propiedades/',
    icon: <Building2 className="h-5 w-5 text-blue-600" />,
    title: 'Gestión de Propiedades',
    desc: 'Administrar propiedades disponibles, ocupadas y en mantenimiento',
  },
  {
    to: '/clientes/',
    icon: <Users className="h-5 w-5 text-green-600" />,
    title: 'Gestión de Clientes',
    desc: 'Administrar información de propietarios, inquilinos y compradores',
  },
  {
    to: '/contratos/',
    icon: <FileText className="h-5 w-5 text-purple-600" />,
    title: 'Contratos',
    desc: 'Crear y gestionar contratos de alquiler y venta',
  },
  {
    to: '/facturacion/',
    icon: <Receipt className="h-5 w-5 text-red-600" />,
    title: 'Facturación',
    desc: 'Generar facturas y gestionar estados de cuenta',
  },
  {
    to: '/statistics/',
    icon: <BarChart3 className="h-5 w-5 text-indigo-600" />,
    title: 'Reportes y Análisis',
    desc: 'Generar reportes detallados y análisis de datos',
  },
];
function RouteComponent() {
  return <div className="m-4">
    <main className={cn("flex-1 transition-all duration-300 pt-16 lg:pt-6")}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Hola, {}</h1>
            <p className="text-muted-foreground">Bienvenido al sistema de gestión de la Inmobiliaria Altos del Valle</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <TileCard key={tile.to} {...tile} />
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
}
