import { useMemo, useState } from 'react'
import { BarChart, ScatterChart } from '@mui/x-charts'
import {  CardTitle } from '@/components/ui/card';
import { useGetEstadisticasAgentes } from '@/modules/estadisticas/hooks/statsHooks'

const currency = (v: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(v)

const integer = (v: number) => new Intl.NumberFormat('es-CR').format(v)

export function PanelAgentes() {
  const { estadisticasAgentes, loadingEstadisticasAgentes, errorEstadisticasAgentes } = useGetEstadisticasAgentes()
  const [q, setQ] = useState('')

  const data = useMemo(() => estadisticasAgentes ?? [], [estadisticasAgentes])

  const agentes = useMemo(() => {
    const base = [...data].sort((a, b) => b.TotalComisiones - a.TotalComisiones)
    if (!q.trim()) return base
    const n = q.toLowerCase()
    return base.filter(a => a.Agente.toLowerCase().includes(n))
  }, [data, q])

  const topLabels = agentes.map(a => a.Agente)

  const serieVolumen = agentes.map(a => a.TotalContratos)
  const serieCierres = agentes.map(a => a.ContratosFinalizados)

  const puntosScatter = agentes.map(a => ({
    x: a.TotalContratos,
    y: a.TotalComisiones,
    size: Math.max(6, Math.sqrt(Math.abs(a.PromedioMontoContrato || 0)) / 2000),
    id: a.Agente,
  }))

    if (loadingEstadisticasAgentes) return <div className="p-6">Cargando…</div>
    if (errorEstadisticasAgentes) return <div className="p-6">Error al cargar</div>
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Ranking por comisiones</CardTitle>
        </div>

        <ul className="space-y-3">
          {agentes.map((a, idx) => (
            <li key={a.Agente}>
              <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right tabular-nums">{idx + 1}</span>
                  <div>
                    <div className="font-medium leading-tight">{a.Agente}</div>
                    <div className="text-sm text-muted-foreground">
                      {integer(a.TotalContratos)} contratos
                      {typeof a.ContratosFinalizados === 'number' && (
                        <span className="ml-2">· {integer(a.ContratosFinalizados)} finalizados</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold">{currency(a.TotalComisiones)}</div>
                  <div className="text-xs text-muted-foreground">comisiones</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <CardTitle>Volumen vs cierres por agente</CardTitle>
        <BarChart
          height={340}
          xAxis={[{ scaleType: 'band', data: topLabels, label: 'Agente' }]}
          series={[
            { data: serieVolumen, label: 'Total contratos' },
            { data: serieCierres, label: 'Contratos finalizados' },
          ]}
          margin={{ top: 16, right: 16, bottom: 64, left: 48 }}
        />
      </section>

      <section>
        <CardTitle>Productividad: contratos vs comisiones</CardTitle>
        <ScatterChart
          height={360}
          xAxis={[{ label: 'Total contratos' }]}
          yAxis={[{ label: 'Total comisiones (₡)', valueFormatter: (v) => currency(Number(v)) }]}
          series={[
            {
              label: 'Agentes',
              data: puntosScatter,
              valueFormatter: (p) =>
                `${p?.id}\nContratos: ${integer(Number(p?.x))}\nComisiones: ${currency(Number(p?.y))}`,
            },
          ]}
          margin={{ top: 24, right: 24, bottom: 48, left: 64 }}
        />
      </section>
    </div>
  )
}
