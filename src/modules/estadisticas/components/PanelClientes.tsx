import { useMemo, useState } from 'react'
import { BarChart } from '@mui/x-charts'
import { CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetFacturacionClientes, useGetHistorialClientes } from '@/modules/estadisticas/hooks/statsHooks'
import { currency } from '../utils/stats'

export function PanelClientes() {
  const { facturacionClientes, loadingFacturacionClientes, errorFacturacionClientes } = useGetFacturacionClientes()

  const { estadisticasHistorialClientes, errorEstadisticasHistorialClientes,loadingEstadisticasHistorialClientes } = useGetHistorialClientes()
  const [q, setQ] = useState('')
  const [topN, setTopN] = useState('10') 

  const loading = loadingFacturacionClientes || loadingEstadisticasHistorialClientes
  const error = errorFacturacionClientes || errorEstadisticasHistorialClientes

  const clientesFiltrados = useMemo(() => {
    const base = [...facturacionClientes]
    if (q.trim()) {
      const n = q.toLowerCase()
      return base.filter(c => c.Cliente.toLowerCase().includes(n))
    }
    return base
  }, [facturacionClientes, q])

  const ordenMontoDesc = useMemo(
    () => [...clientesFiltrados].sort((a, b) => (b.MontoTotal ?? 0) - (a.MontoTotal ?? 0)),
    [clientesFiltrados]
  )
  const ordenContratosDesc = useMemo(
    () => [...clientesFiltrados].sort((a, b) => (b.TotalContratos ?? 0) - (a.TotalContratos ?? 0)),
    [clientesFiltrados]
  )

  const sliceCount = topN === 'all' ? Infinity : Number(topN)

  const labelsMonto = useMemo(
    () => ordenMontoDesc.slice(0, sliceCount).map(c => c.Cliente),
    [ordenMontoDesc, sliceCount]
  )
  const dataMonto = useMemo(
    () => ordenMontoDesc.slice(0, sliceCount).map(c => c.MontoTotal ?? 0),
    [ordenMontoDesc, sliceCount]
  )

  const labelsContratos = useMemo(
    () => ordenContratosDesc.slice(0, sliceCount).map(c => c.Cliente),
    [ordenContratosDesc, sliceCount]
  )
  const dataContratos = useMemo(
    () => ordenContratosDesc.slice(0, sliceCount).map(c => c.TotalContratos ?? 0),
    [ordenContratosDesc, sliceCount]
  )

  const historialFiltrado = useMemo(() => {
      if (!q.trim()) return estadisticasHistorialClientes
    const n = q.toLowerCase()
      return (estadisticasHistorialClientes ?? []).filter(h => h.Cliente.toLowerCase().includes(n))
  }, [estadisticasHistorialClientes, q])

  if (loading) return <div className="p-6">Cargando…</div>
  if (error) return <div className="p-6">Error al cargar estadísticas</div>

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label className="text-sm font-medium">Buscar cliente</label>
          <Input placeholder="Nombre del cliente…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Top N</label>
          <Select value={topN} onValueChange={setTopN}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Top N" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section>
        <CardTitle>Facturación por cliente (₡)</CardTitle>
        <BarChart
          height={360}
          layout="horizontal"
          yAxis={[{ scaleType: 'band', data: labelsMonto }]}
          series={[{ label: 'Monto total', data: dataMonto }]}
          xAxis={[{ valueFormatter: (v) => currency(Number(v)) }]}
          margin={{ top: 16, right: 24, bottom: 48, left: 200 }}
        />
      </section>

      <section>
        <CardTitle>Contratos por cliente (#)</CardTitle>
        <BarChart
          height={360}
          layout="horizontal"
          yAxis={[{ scaleType: 'band', data: labelsContratos }]}
          series={[{ label: '# Contratos', data: dataContratos }]}
          margin={{ top: 16, right: 24, bottom: 48, left: 200 }}
        />
      </section>

      <section>
        <CardTitle>Historial de contratos por cliente</CardTitle>
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-3">Fecha inicio</th>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Propiedad</th>
                <th className="text-left p-3">Agente</th>
                <th className="text-right p-3">Monto (₡)</th>
                <th className="text-right p-3">Meses</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.map((h, idx) => (
                <tr key={`${h.Cliente}-${h.FechaInicio}-${idx}`} className="border-t">
                  <td className="p-3">{new Date(h.FechaInicio).toLocaleDateString('es-CR')}</td>
                  <td className="p-3">{h.Cliente}</td>
                  <td className="p-3">{h.NombreRol}</td>
                  <td className="p-3">{h.TipoContrato}</td>
                  <td className="p-3">{h.Propiedad}</td>
                  <td className="p-3">{h.AgenteEncargado}</td>
                  <td className="p-3 text-right">{currency(h.MontoTotalContrato ?? 0)}</td>
                  <td className="p-3 text-right">{h.DuracionMeses ?? 0}</td>
                  <td className="p-3">{h.EstadoContrato}</td>
                </tr>
              ))}
              {!historialFiltrado.length && (
                <tr><td className="p-4 text-muted-foreground" colSpan={9}>Sin resultados…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
