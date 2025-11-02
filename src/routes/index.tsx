import StatisticsCard from '@/components/StatisticsCard'
import TileCard from '@/components/TileCard'
import { cn } from '@/lib/utils'
import { useGetDashboardReport } from '@/modules/estadisticas/hooks/statsHooks'
import { getUserInfoFromToken, protectRoute } from '@/modules/seguridad/utils/authGuard'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, Building2, FileText, Receipt, Users, LandPlot, ReceiptText, Scroll } from 'lucide-react'

import { fmtCRC } from "@/utils/moneyFormatter";
import Skeleton from 'node_modules/@mui/material/esm/Skeleton/Skeleton'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['AGENTE', 'ADMINISTRADOR', 'LECTOR'])
  },
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
  const userInfo = getUserInfoFromToken();
  const { dashboardReport, loadingDashboardReport, errorDashboardReport } = useGetDashboardReport();

  return <div className="m-4">
    <main className={cn("flex-1 transition-all duration-300 pt-16 lg:pt-6")}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Hola, {userInfo?.name}</h1>
            <p className="text-muted-foreground">Bienvenido al sistema de gestión de la Inmobiliaria Altos del Valle</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {loadingDashboardReport && <div className="max-w-[300px] w-full flex items-center gap-3">
              <div>
                <Skeleton className="flex rounded-full w-12 h-12" />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </div>
            </div>}
            {errorDashboardReport && <div className="text-destructive">Error cargando datos del dashboard.</div>}
            {dashboardReport && dashboardReport.length > 0 && (
              <>
                <StatisticsCard
                  icon={<LandPlot className="h-5 w-5 text-green-600" />}
                  title="Total de propiedades registradas"
                  value={dashboardReport[0]?.TotalPropiedades || 0}
                />

                <StatisticsCard
                  icon={<Scroll className="h-5 w-5 text-orange-600" />}
                  title="Total de contratos en el sistema"
                  value={dashboardReport[0]?.TotalContratos || 0}
                />
                <StatisticsCard
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                  title="Total de clientes en el sistema"
                  value={dashboardReport[0]?.TotalClientes || 0}
                />
                <StatisticsCard
                  icon={<BarChart3 className="h-5 w-5 text-amber-600" />}
                  title="Monto total generado por contratos"
                  value={fmtCRC(dashboardReport[0]?.MontoTotalContratos || 0)}
                />
                <StatisticsCard
                  icon={<ReceiptText className="h-5 w-5 text-cyan-500" />}
                  title="Total asignado en comisiones"
                  value={fmtCRC(dashboardReport[0]?.TotalComisiones || 0)}
                />
              </>
            )}
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
