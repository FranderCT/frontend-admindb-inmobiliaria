/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { BarChart } from "@mui/x-charts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetFacturacionClientes,
    useGetHistorialClientes,
} from "@/modules/estadisticas/hooks/statsHooks";
import { currency } from "../utils/stats";

import { PALETTE } from "../utils/stats";

export function PanelClientes() {
    const { facturacionClientes, loadingFacturacionClientes, errorFacturacionClientes } =
        useGetFacturacionClientes();
    const {
        estadisticasHistorialClientes,
        errorEstadisticasHistorialClientes,
        loadingEstadisticasHistorialClientes,
    } = useGetHistorialClientes();

    const [q, setQ] = useState("");
    const [topN, setTopN] = useState("10");

    const loading = loadingFacturacionClientes || loadingEstadisticasHistorialClientes;
    const error = errorFacturacionClientes || errorEstadisticasHistorialClientes;

    const ordenMontoDesc = useMemo(
        () =>
            [...facturacionClientes].sort(
                (a, b) => (b.MontoTotal ?? 0) - (a.MontoTotal ?? 0)
            ),
        [facturacionClientes]
    );

    const ordenContratosDesc = useMemo(
        () =>
            [...facturacionClientes].sort(
                (a, b) => (b.TotalContratos ?? 0) - (a.TotalContratos ?? 0)
            ),
        [facturacionClientes]
    );

    const sliceCount = topN === "all" ? Infinity : Number(topN);

    const labelsMonto = useMemo(
        () => ordenMontoDesc.slice(0, sliceCount).map((c) => c.Cliente),
        [ordenMontoDesc, sliceCount]
    );
    const dataMonto = useMemo(
        () => ordenMontoDesc.slice(0, sliceCount).map((c) => c.MontoTotal ?? 0),
        [ordenMontoDesc, sliceCount]
    );

    const labelsContratos = useMemo(
        () => ordenContratosDesc.slice(0, sliceCount).map((c) => c.Cliente),
        [ordenContratosDesc, sliceCount]
    );
    const dataContratos = useMemo(
        () => ordenContratosDesc.slice(0, sliceCount).map((c) => c.TotalContratos ?? 0),
        [ordenContratosDesc, sliceCount]
    );

    const historialFiltrado = useMemo(() => {
        const base = estadisticasHistorialClientes ?? [];
        if (!q.trim()) return base;
        const n = q.toLowerCase();
        return base.filter((h) => h.Cliente.toLowerCase().includes(n));
    }, [estadisticasHistorialClientes, q]);

    const empty = (arr?: any[]) => !arr || arr.length === 0;

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((k) => (
                    <Card key={k} className="h-[420px]">
                        <CardHeader>
                            <Skeleton className="h-6 w-2/3" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardHeader>
                        <CardContent className="px-2 pb-6">
                            <Skeleton className="h-[300px] w-full rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-red-600 px-4 py-8">
                Ocurrió un problema obteniendo las estadísticas. Intenta nuevamente.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Card>
                <CardHeader>
                    <CardTitle>Facturación por cliente en colones</CardTitle>
                    <CardDescription>
                        Ranking por monto total pagado segun cada cliente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-6">
                    {empty(labelsMonto) ? (
                        <div className="text-sm text-muted-foreground px-4 py-8">
                            No hay datos para mostrar en este periodo.
                        </div>
                    ) : (
                        <BarChart
                            height={360}
                            layout="horizontal"
                            colors={PALETTE}
                            yAxis={[{ scaleType: "band", data: labelsContratos, label: "Cliente" }]}
                            series={[{ label: "Monto total", data: dataMonto, color: PALETTE[0] }]}
                            xAxis={[{ label: "Monto en colones", valueFormatter: (v) => currency(Number(v)) }]}
                            margin={{ top: 16, right: 16, bottom: 0, left: 30 }}
                        />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cantidad de contratos por cliente</CardTitle>
                    <CardDescription>
                        Ranking por cantidad de contratos asociados a cada cliente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-6">
                    {empty(labelsContratos) ? (
                        <div className="text-sm text-muted-foreground px-4 py-8">
                            No hay datos para mostrar en este periodo.
                        </div>
                    ) : (
                        <BarChart
                            height={360}
                            layout="horizontal"
                            colors={PALETTE}
                            yAxis={[{ scaleType: "band", data: labelsContratos, label: "Cliente" }]}
                            series={[
                                { label: "Cantidad de contratos", 
                                    data: dataContratos, 
                                    color: PALETTE[5] 
                                },
                            ]}
                            xAxis={[{ label: "Cantidad de contratos" }]}
                            margin={{ top: 16, right: 24, bottom: 0, left: 30 }}
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Historial de contratos por cliente</CardTitle>
                    <CardDescription>
                        Detalle de operaciones por cliente con fechas, roles y montos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                {(historialFiltrado ?? []).map((h, idx) => (
                                    <tr
                                        key={`${h.Cliente}-${h.FechaInicio}-${idx}`}
                                        className="border-t"
                                    >
                                        <td className="p-3">
                                            {new Date(h.FechaInicio).toLocaleDateString("es-CR")}
                                        </td>
                                        <td className="p-3">{h.Cliente}</td>
                                        <td className="p-3">{h.NombreRol}</td>
                                        <td className="p-3">{h.TipoContrato}</td>
                                        <td className="p-3">{h.Propiedad}</td>
                                        <td className="p-3">{h.AgenteEncargado}</td>
                                        <td className="p-3 text-right">
                                            {currency(h.MontoTotalContrato ?? 0)}
                                        </td>
                                        <td className="p-3 text-right">{h.DuracionMeses ?? 0}</td>
                                        <td className="p-3">{h.EstadoContrato}</td>
                                    </tr>
                                ))}
                                {!historialFiltrado?.length && (
                                    <tr>
                                        <td className="p-4 text-muted-foreground" colSpan={9}>
                                            Sin resultados…
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
