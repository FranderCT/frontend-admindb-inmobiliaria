import { useMemo, useState } from 'react'
import { BarChart, PieChart } from '@mui/x-charts'
import { CardTitle } from '@/components/ui/card'
import { useGetPropiedadesEstado, useGetPropiedadesTipoInmueble, useGetPropiedadesTop } from '../hooks/statsHooks'
import { currency } from '../utils/stats'

export function PanelPropiedades() {
    const { propiedadesEstado, loadingPropiedadesEstado, errorPropiedadesEstado } = useGetPropiedadesEstado()
    const { errorPropiedadesTop, fetchingPropiedadesTop, propiedadesTop } = useGetPropiedadesTop()
    const { errorPropiedadesTipoInmueble,loadingPropiedadesTipoInmueble,propiedadesTipoInmueble } = useGetPropiedadesTipoInmueble()

  const loading = loadingPropiedadesEstado || fetchingPropiedadesTop || loadingPropiedadesTipoInmueble
  const error = errorPropiedadesEstado || errorPropiedadesTop || errorPropiedadesTipoInmueble

  const [verMonto, setVerMonto] = useState(false)

  const estadoLabels = useMemo(
    () => (propiedadesEstado ?? []).map(e => e.EstadoPropiedad),
    [propiedadesEstado]
  )
  const estadoData = useMemo(
    () => (propiedadesEstado ?? []).map(e => e.TotalPropiedades),
    [propiedadesEstado]
  )
  const estadoPie = useMemo(
    () => (propiedadesEstado ?? []).map(e => ({ id: e.EstadoPropiedad, value: e.TotalPropiedades, label: e.EstadoPropiedad })),
    [propiedadesEstado]
  )
  const topLabels = useMemo(
      () => (propiedadesTop ?? []).map(p => p.Ubicacion),
    [propiedadesTop]
  )
  const topSerie = useMemo(
      () => (propiedadesTop ?? []).map(p => verMonto ? (p.TotalMonto ?? 0) : (p.TotalContratos ?? 0)),
      [propiedadesTop, verMonto]
  )

  const tipoPie = useMemo(
    () => (propiedadesTipoInmueble ?? []).map(d => ({ id: d.TipoInmueble, value: d.TotalContratos, label: d.TipoInmueble })),
    [propiedadesTipoInmueble]
  )

  if (loading) return <div className="p-6">Cargando…</div>
  if (error) return <div className="p-6">Error al cargar estadísticas</div>

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <CardTitle>Estado de las propiedades (Bar)</CardTitle>
          <BarChart
            height={300}
            xAxis={[{ scaleType: 'band', data: estadoLabels }]}
            series={[{ label: 'Propiedades', data: estadoData }]}
            margin={{ top: 16, right: 16, bottom: 48, left: 48 }}
          />
        </div>

        <div className="border rounded-md p-6">
          <CardTitle>Estado de las propiedades (Proporción)</CardTitle>
          <PieChart
            height={300}
            series={[{ data: estadoPie }]}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle>Top propiedades más {verMonto ? 'rentables (₡)' : 'contratadas (#)'}</CardTitle>
          <button
            type="button"
            className="text-sm text-blue-600"
            onClick={() => setVerMonto(v => !v)}
          >
            {verMonto ? 'Ver contratos' : 'Ver monto'}
          </button>
        </div>
        <BarChart
          height={340}
          layout="horizontal"
          yAxis={[{ scaleType: 'band', data: topLabels }]}
          series={[{
            label: verMonto ? 'Monto total' : 'Total contratos',
            data: topSerie,
          }]}
          xAxis={[{ valueFormatter: (v) => verMonto ? currency(Number(v)) : `${v}` }]}
          margin={{ top: 16, right: 24, bottom: 48, left: 160 }}
        />
        <div className="border rounded-md p-6">
          <CardTitle>Tipo de inmueble (Proporción)</CardTitle>
          <PieChart
            height={300}
            series={[{ data: tipoPie }]}
          />
        </div>
      </section>
    </div>
  )
}
