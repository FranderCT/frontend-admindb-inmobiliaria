import { CardTitle } from '@/components/ui/card'
import { useMemo } from 'react'
import { currency, monthIndex, monthsLabels } from '../utils/stats'
import { useGetContratoEstado, useGetContratosMes, useGetContratosTipo } from '../hooks/statsHooks'
import { BarChart, LineChart, PieChart } from '@mui/x-charts'
import { vistaContratosPorTipo } from '../model/reportes'

const PanelContratos = () => {
    const { estadisticasContratosMes, loadingEstadisticasContratosMes, errorEstadisticasContratosMes } = useGetContratosMes()
    const { contratosTipo, loadingContratosTipo, errorContratosTipo } = useGetContratosTipo()
    const { estadisticasContratoEstado, loadingEstadisticasContratoEstado, errorEstadisticasContratoEstado } = useGetContratoEstado()
    const error = errorEstadisticasContratosMes || errorContratosTipo || errorEstadisticasContratoEstado
    const loading = loadingEstadisticasContratosMes || loadingContratosTipo || loadingEstadisticasContratoEstado

    const seriesContratosLinea = useMemo(() => {
        const porAnio: Record<string, number[]> = {}
            ; (estadisticasContratosMes ?? []).forEach(m => {
                const idx = monthIndex[(m.NombreMes || '').toLowerCase()]
                if (idx == null || idx < 0) return
                const anio = String(m.Anio ?? '')
                porAnio[anio] ||= new Array(12).fill(0)
                porAnio[anio][idx] += m.TotalContratos
            })
        return Object.entries(porAnio)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([anio, data]) => ({ label: anio, data }))
    }, [estadisticasContratosMes])

    const barMontoMes = useMemo(() => {
        if (!estadisticasContratosMes?.length) return [{ label: 'Monto total', data: new Array(12).fill(0) }]
        const years = Array.from(new Set(estadisticasContratosMes.map(m => Number(m.Anio)))).sort((a, b) => a - b)
        const latest = years[years.length - 1]
        const arr = new Array(12).fill(0)
        estadisticasContratosMes
            .filter(m => Number(m.Anio) === latest)
            .forEach(m => {
                const idx = monthIndex[(m.NombreMes || '').toLowerCase()]
                if (idx != null && idx >= 0) arr[idx] += m.MontoTotal
            })
        return [{ label: `Monto total ${latest}`, data: arr }]
    }, [estadisticasContratosMes])

    const pieDataContratos = useMemo(
        () => contratosTipo?.map((d: vistaContratosPorTipo) => ({ id: d.TipoContrato, value: d.TotalContratos, label: d.TipoContrato })) ?? [],
        [contratosTipo]
    )
    const pieEstado = useMemo(() => {
        return (estadisticasContratoEstado ?? []).map(e => ({
            id: e.EstadoContrato,
            value: e.TotalContratos,
            label: e.EstadoContrato,
        }))
    }, [estadisticasContratoEstado])

    if (loading) return <div className="p-6">Cargando…</div>
    if (error) return <div className="p-6">Error al cargar</div>
    return (
        <div>
            <section>
                <CardTitle>Contratos por mes (tendencia)</CardTitle>
                <LineChart
                    height={320}
                    xAxis={[{ scaleType: 'point', data: monthsLabels }]}
                    series={seriesContratosLinea}
                    margin={{ top: 16, right: 16, bottom: 32, left: 48 }}
                />
            </section>

            <section>
                <CardTitle>Monto total por mes (año más reciente)</CardTitle>
                <BarChart
                    height={300}
                    xAxis={[{ scaleType: 'band', data: monthsLabels }]}
                    series={barMontoMes}
                    yAxis={[{ valueFormatter: (v) => currency(Number(v)) }]}
                    margin={{ top: 16, right: 16, bottom: 32, left: 60 }}
                />
            </section>

            <section className="">
                <CardTitle>Proporción de contratos por estado</CardTitle>
                <PieChart
                    height={300}
                    series={[{ data: pieEstado }]}
                />
            </section>

            <section >
                <CardTitle>Distribucion por tipo de contrato</CardTitle>
                <PieChart
                    height={300}
                    series={[
                        {
                            data: pieDataContratos,
                        },
                    ]}
                />
            </section>
        </div>
    )
}

export default PanelContratos
