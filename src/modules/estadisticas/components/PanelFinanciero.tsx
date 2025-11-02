import { CardTitle, CardDescription } from '@/components/ui/card'

import { crc, groupBy, monthIndex, monthsLabels } from '../utils/stats'
import { useMemo } from 'react'
import {  useGetContratosMes, useGetContratosTipo, useGetEstadisticasAgentes } from '../hooks/statsHooks'
import { BarChart, LineChart, ScatterChart } from '@mui/x-charts'

const PanelFinanciero = () => {
    const { estadisticasContratosMes, loadingEstadisticasContratosMes, errorEstadisticasContratosMes } = useGetContratosMes()
    const { contratosTipo, loadingContratosTipo, errorContratosTipo } = useGetContratosTipo()
    const { estadisticasAgentes, loadingEstadisticasAgentes, errorEstadisticasAgentes } = useGetEstadisticasAgentes()

    const error = errorEstadisticasContratosMes || errorEstadisticasAgentes || errorContratosTipo
    const loading = loadingEstadisticasContratosMes || loadingEstadisticasAgentes || loadingContratosTipo

    const porAnio = useMemo(() => groupBy(estadisticasContratosMes ?? [], d => d.Anio), [estadisticasContratosMes]);

    const seriesComisiones = useMemo(() => {
        return Object.entries(porAnio).map(([anio, rows]) => {
            const arr = new Array(12).fill(0);
            rows.forEach(r => {
                const idx = monthIndex[(r.NombreMes || '').toLowerCase()] ?? -1;
                if (idx >= 0) arr[idx] = r.MontoTotal;
            });
            return { label: String(anio), data: arr };
        });
    }, [porAnio]);

    const puntosAgentes = useMemo(() => (estadisticasAgentes ?? []).map(a => ({
        x: a.TotalContratos,
        y: a.TotalComisiones,
        size: Math.max(6, Math.sqrt(Math.abs(a.PromedioMontoContrato)) / 2000),
        id: a.Agente,
    })), [estadisticasAgentes]);


    const seriesIngresosMes = useMemo(() => {
        const arr = new Array(12).fill(0);
        (estadisticasContratosMes ?? []).forEach(m => {
            const idx = monthIndex[(m.NombreMes || '').toLowerCase()];
            if (idx >= 0) arr[idx] += m.MontoTotal;
        });
        return [{ label: 'Monto total', data: arr }];
    }, [estadisticasContratosMes]);

    if (loading) return <div className="p-6">Cargando…</div>
    if (error) return <div className="p-6">Error al cargar</div>
    return (
        <div>
            <section>
                <CardTitle>Total de ingresos por tipo de contrato</CardTitle>
                <CardDescription>
                    Cantidad de ingresos generados en total segun el tipo de contrato.
                </CardDescription>
                <BarChart
                    height={300}
                    xAxis={[{ scaleType: 'band', data: contratosTipo?.map(d => d.TipoContrato) ?? [] }]}
                    series={[{ label: 'Monto total', data: contratosTipo?.map(d => d.MontoTotal) ?? [] }]}
                    yAxis={[{ valueFormatter: (v) => crc(Number(v)) }]}
                    margin={{ top: 16, right: 16, bottom: 32, left: 60 }}
                />
            </section>
            <section>
                <CardTitle>Evolución de comisiones por mes</CardTitle>
                <CardDescription>
                    Evolución de las comisiones generadas por mes.
                </CardDescription>
                <LineChart
                    height={320}
                    xAxis={[{ scaleType: 'point', data: monthsLabels }]}
                    series={seriesComisiones}
                    yAxis={[{ valueFormatter: (v) => crc(Number(v)) }]}
                    margin={{ top: 16, right: 16, bottom: 32, left: 56 }}
                />
            </section>
            <section>
                <CardTitle>Productividad</CardTitle>
                <CardDescription>
                    Comparativa entre el total de contratos y el total de comisiones generadas.
                </CardDescription>
                <ScatterChart
                    height={360}
                    xAxis={[{ label: 'Total contratos' }]}
                    yAxis={[{ label: 'Total comisiones (₡)', valueFormatter: (v) => crc(Number(v)) }]}
                    series={[{
                        label: 'Agentes',
                        data: puntosAgentes,
                        valueFormatter: (p) =>
                            `${p?.id}\nContratos: ${p?.x}\nComisiones: ${crc(Number(p?.y))}`,
                    }]}
                    margin={{ top: 24, right: 24, bottom: 48, left: 64 }}
                />
            </section>

            <section>
                <CardTitle>Comparativa de ingresos por mes</CardTitle>
                <CardDescription>
                    Monto total generado por contratos mes a mes.
                </CardDescription>
                <BarChart
                    height={300}
                    xAxis={[{ scaleType: 'band', data: monthsLabels }]}
                    series={seriesIngresosMes}
                    yAxis={[{ valueFormatter: (v) => crc(Number(v)) }]}
                    margin={{ top: 16, right: 16, bottom: 32, left: 60 }}
                />
            </section>
        </div>
    )
}

export default PanelFinanciero
