import { useMemo } from "react"
import { LineChart, PieChart } from "@mui/x-charts"
import { useGetContratosMes, useGetContratosTipo, useGetContratoEstado } from "@/modules/estadisticas/hooks/statsHooks"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { PALETTE } from "@/modules/estadisticas/utils/stats"

const currency = (v: number) =>
    new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(v)

const monthsOrder: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, setiembre: 8, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}
const shortMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function MiniCardsContratosHome() {
    const { estadisticasContratosMes } = useGetContratosMes()
    const { contratosTipo } = useGetContratosTipo()
    const { estadisticasContratoEstado } = useGetContratoEstado()

    const sortedAll = useMemo(() => {
        return [...(estadisticasContratosMes ?? [])]
            .filter(m => monthsOrder[(m.NombreMes || "").toLowerCase()] !== undefined)
            .sort((a, b) => (Number(a.Anio) - Number(b.Anio)) ||
                (monthsOrder[(a.NombreMes || "").toLowerCase()] - monthsOrder[(b.NombreMes || "").toLowerCase()]))
    }, [estadisticasContratosMes])

    const currentMonth = sortedAll.at(-1)
    const ingresosMesActual = currentMonth?.MontoTotal ?? 0

    const historyAll = useMemo(() => {
        const labels = sortedAll.map(m => {
            const idx = monthsOrder[(m.NombreMes || "").toLowerCase()]
            const mm = shortMonths[idx] ?? m.NombreMes
            return `${mm} ${m.Anio}`
        })
        const ingresos = sortedAll.map(m => m.MontoTotal ?? 0)
        return {
            labels,
            series: [{ label: "Ingresos", data: ingresos }],
        }
    }, [sortedAll])

    const pieTipos = useMemo(
        () => (contratosTipo ?? []).map(d => ({ id: d.TipoContrato, label: d.TipoContrato, value: d.TotalContratos ?? 0 })),
        [contratosTipo]
    )

    const pieEstado = useMemo(
        () => (estadisticasContratoEstado ?? []).map(e => ({ id: e.EstadoContrato, label: e.EstadoContrato, value: e.TotalContratos ?? 0 })),
        [estadisticasContratoEstado]
    )

    return (
        <div className="flex gap-4 text-sm">
            <Card className="p-3 w-90 h-60">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <CardTitle>
                            Ingresos mensuales
                        </CardTitle>
                        <CardDescription>
                            Ingresos por contratos de manera mensual (últimos {historyAll.labels.length} meses)
                        </CardDescription>
                    </div>
                </div>

                {historyAll.series[0].data.length ? (
                    <LineChart
                        height={70}
                        xAxis={[{ scaleType: "point", data: historyAll.labels }]}
                        series={historyAll.series}
                        yAxis={[{ valueFormatter: v => currency(Number(v)) }]}
                        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                        colors={PALETTE.slice(0, 1)}
                    />
                ) : (
                    <div className="text-xs text-muted-foreground mt-2">Sin datos</div>
                )}
            </Card>

            <Card className="p-3 w-60 h-60">
                <div>
                    <CardTitle className="text-sm mb-1">Total de contratos por tipo</CardTitle>
                    <CardDescription>
                        Proporción de contratos según su tipo
                    </CardDescription>
                </div>

                {pieTipos.length ? (
                    <PieChart height={120} series={[{ data: pieTipos }]} colors={PALETTE.slice(2, 4)} />
                ) : <div className="text-xs text-muted-foreground mt-2">Sin datos</div>}
            </Card>

            <Card className="p-3 w-60  h-60">
                <div>

                    <CardTitle>
                        Proporción de finali    zación
                    </CardTitle>
                    <CardDescription>
                        Comparativa del estado actual de todos los contratos en el sistema
                    </CardDescription>
                </div>
                {pieEstado.length ? (
                    <PieChart height={120} series={[{ data: pieEstado }]} colors={PALETTE.slice(2, 4)} />
                ) : <div className="text-xs text-muted-foreground mt-2">Sin datos</div>}
            </Card>
        </div>
    )
}

export default MiniCardsContratosHome
