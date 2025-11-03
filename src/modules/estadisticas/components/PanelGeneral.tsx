/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { LineChart, BarChart, ScatterChart } from "@mui/x-charts";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetContratosMes,
  useGetContratosTipo,
  useGetEstadisticasAgentes,
} from "@/modules/estadisticas/hooks/statsHooks";
import { useGetHistorialClientes } from "@/modules/estadisticas/hooks/statsHooks";
import { useGetPropiedadesEstado } from "@/modules/estadisticas/hooks/statsHooks";
import { BarChart3, ChartBarStacked, TrendingUp } from "lucide-react";
import StatisticsCard from "@/components/StatisticsCard";
import { monthIndex, monthsLabels } from "../utils/stats";

const crc = (v: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(v);
const intFmt = (v: number) => new Intl.NumberFormat("es-CR").format(v);

// paleta
const PALETTE = ["#60A5FA","#84CC8E","#FBBF24","#F472B6","#A78BFA","#F59E0B","#22D3EE","#E879F9","#34D399","#93C5FD","#FB7185","#E1C27A"];


export default function PanelGeneral() {
  const { estadisticasContratosMes, loadingEstadisticasContratosMes, errorEstadisticasContratosMes } = useGetContratosMes();
  const { contratosTipo, loadingContratosTipo, errorContratosTipo } = useGetContratosTipo();
  const { estadisticasAgentes, loadingEstadisticasAgentes, errorEstadisticasAgentes } = useGetEstadisticasAgentes();
  const { estadisticasHistorialClientes, loadingEstadisticasHistorialClientes, errorEstadisticasHistorialClientes } = useGetHistorialClientes();
  const { propiedadesEstado, loadingPropiedadesEstado, errorPropiedadesEstado } = useGetPropiedadesEstado();

  const loading =
    loadingEstadisticasContratosMes ||
    loadingContratosTipo ||
    loadingEstadisticasAgentes ||
    loadingEstadisticasHistorialClientes ||
    loadingPropiedadesEstado;

  const error =
    errorEstadisticasContratosMes ||
    errorContratosTipo ||
    errorEstadisticasAgentes ||
    errorEstadisticasHistorialClientes ||
    errorPropiedadesEstado;

  const {
    kpiMesLabel,
    kpiContratos,
    kpiIngresos
  } = useMemo(() => {
    const rows = (estadisticasContratosMes ?? []).slice().sort((a: any, b: any) =>
      a.Anio !== b.Anio ? a.Anio - b.Anio :
      (monthIndex[(a.NombreMes || "").toLowerCase()] ?? -1) - (monthIndex[(b.NombreMes || "").toLowerCase()] ?? -1)
    );
    const last = rows[rows.length - 1];
    const lastYear = Number(last?.Anio) || undefined;
    const lastMonthIdx = monthIndex[(last?.NombreMes || "").toLowerCase()];
    const kpiMesLabel = lastYear && lastMonthIdx >= 0 ? `${monthsLabels[lastMonthIdx]} ${lastYear}` : "—";

    let kpiContratos = 0, kpiIngresos = 0;
    rows.forEach((r: any) => {
      const idx = monthIndex[(r.NombreMes || "").toLowerCase()];
      if (Number(r.Anio) === lastYear && idx === lastMonthIdx) {
        kpiContratos += Number(r.TotalContratos || 0);
        kpiIngresos += Number(r.MontoTotal || 0);
      }
    });

    let kpiClientesNuevos = 0;
    if (lastYear && lastMonthIdx >= 0) {
      const setClientes = new Set<string>();
      (estadisticasHistorialClientes ?? []).forEach((h: any) => {
        const d = new Date(h.FechaInicio);
        if (d.getFullYear() === lastYear && d.getMonth() === lastMonthIdx) {
          setClientes.add(h.Cliente);
        }
      });
      kpiClientesNuevos = setClientes.size;
    }

    const propAct = (propiedadesEstado ?? []).find((e: any) =>
      String(e.EstadoPropiedad).toLowerCase() === "disponible"
    );
    const kpiPropActivas = Number(propAct?.TotalPropiedades || 0);

    return { kpiMesLabel, kpiContratos, kpiIngresos, kpiClientesNuevos, kpiPropActivas };
  }, [estadisticasContratosMes, estadisticasHistorialClientes, propiedadesEstado]);

  const { serieContratosUltAnio, serieIngresosUltAnio, yearLabel } = useMemo(() => {
    const rows = estadisticasContratosMes ?? [];
    if (!rows.length) return { serieContratosUltAnio: [{ label: "Contratos", data: new Array(12).fill(0), color: PALETTE[2] }], serieIngresosUltAnio: [{ label: "Ingresos", data: new Array(12).fill(0), color: PALETTE[0] }], yearLabel: "—" };
    const years = Array.from(new Set(rows.map((r: any) => Number(r.Anio)))).sort((a, b) => a - b);
    const lastYear = years[years.length - 1];
    const contratos = new Array(12).fill(0);
    const ingresos = new Array(12).fill(0);
    rows.filter((r: any) => Number(r.Anio) === lastYear).forEach((r: any) => {
      const idx = monthIndex[(r.NombreMes || "").toLowerCase()];
      if (idx >= 0) {
        contratos[idx] += Number(r.TotalContratos || 0);
        ingresos[idx] += Number(r.MontoTotal || 0);
      }
    });
    return {
      serieContratosUltAnio: [{ label: "Contratos", data: contratos, color: PALETTE[2] }],
      serieIngresosUltAnio: [{ label: "Ingresos", data: ingresos, color: PALETTE[0] }],
      yearLabel: String(lastYear),
    };
  }, [estadisticasContratosMes]);

  const rentabilidadSeries = useMemo(() => {
    const ventas = (contratosTipo ?? []).filter((t: any) => String(t.TipoContrato).toLowerCase().includes("venta"))
      .reduce((acc: number, it: any) => acc + Number(it.MontoTotal || 0), 0);
    const alquileres = (contratosTipo ?? []).filter((t: any) => String(t.TipoContrato).toLowerCase().includes("alquiler"))
      .reduce((acc: number, it: any) => acc + Number(it.MontoTotal || 0), 0);
    const comisiones = (estadisticasAgentes ?? []).reduce((acc: number, a: any) => acc + Number(a.TotalComisiones || 0), 0);

    const dataset = [
      { area: "Ventas", valor: ventas },
      { area: "Alquileres", valor: alquileres },
      { area: "Comisiones", valor: comisiones },
    ];
    return dataset;
  }, [contratosTipo, estadisticasAgentes]);

  const puntosCorr = useMemo(() => {
    const rows = estadisticasContratosMes ?? [];
    if (!rows.length) return [];
    const years = Array.from(new Set(rows.map((r: any) => Number(r.Anio)))).sort((a, b) => a - b);
    const lastYear = years[years.length - 1];
    const acc: { x: number; y: number; id: string }[] = [];
    for (let m = 0; m < 12; m++) {
      const subset = rows.filter((r: any) => Number(r.Anio) === lastYear && monthIndex[(r.NombreMes || "").toLowerCase()] === m);
      const x = subset.reduce((s, r: any) => s + Number(r.TotalContratos || 0), 0);
      const y = subset.reduce((s, r: any) => s + Number(r.MontoTotal || 0), 0);
      acc.push({ x, y, id: `${monthsLabels[m]} ${lastYear}` });
    }
    return acc;
  }, [estadisticasContratosMes]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map((k) => (
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

  const empty = (arr?: any[]) => !arr || arr.length === 0;

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex gap-10">

        <StatisticsCard
          size="large"
          icon={<BarChart3 className="h-5 w-5 text-amber-600" />} 
          title={"Periodo"} 
          value={kpiMesLabel}/>

        <StatisticsCard
          size="large"
          icon={<ChartBarStacked className="h-5 w-5 text-amber-600" />}
          title={"Contratos en el último mes"}
          value={intFmt(kpiContratos)}/>

        <StatisticsCard
        size="large"
          icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
          title={"Ingresos en el último mes"}
          value={crc(kpiIngresos)} />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de crecimiento ({yearLabel})</CardTitle>
            <CardDescription>Evolución mensual de contratos e ingresos.</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-6">
            {empty(estadisticasContratosMes) ? (
              <div className="text-sm text-muted-foreground px-4 py-8">No hay datos para mostrar en este periodo.</div>
            ) : (
              <LineChart
                height={320}
                colors={PALETTE}
                xAxis={[{ scaleType: "point", data: monthsLabels, label: "Mes" }]}
                series={[
                  ...serieContratosUltAnio,
                  ...serieIngresosUltAnio.map(s => ({ ...s, yAxisKey: "money" })),
                ]}
                yAxis={[
                  { id: "count", label: "Contratos", valueFormatter: (v) => intFmt(Number(v)) },
                  { id: "money", label: "Ingresos (₡)", valueFormatter: (v) => crc(Number(v)) },
                ]}
                margin={{ top: 16, right: 24, bottom: 0, left: 20 }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Áreas más rentables</CardTitle>
            <CardDescription>Comparación entre ventas, alquileres y comisiones.</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-6">
            {empty(rentabilidadSeries) ? (
              <div className="text-sm text-muted-foreground px-4 py-8">No hay datos para mostrar en este periodo.</div>
            ) : (
              <BarChart
                height={320}
                colors={PALETTE}
                dataset={rentabilidadSeries}
                xAxis={[{ scaleType: "band", dataKey: "area", label: "Área" }]}
                series={[{ dataKey: "valor", label: "Monto (₡)", color: PALETTE[0], valueFormatter: v => crc(Number(v)) }]}
                yAxis={[{ label: "Monto (₡)", valueFormatter: (v) => crc(Number(v)) }]}
                margin={{ top: 16, right: 16, bottom: 0, left: 20 }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Correlación: contratos vs ingresos por mes</CardTitle>
            <CardDescription>Relación entre cantidad de contratos y monto generado.</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-6">
            {empty(puntosCorr) ? (
              <div className="text-sm text-muted-foreground px-4 py-8">No hay datos para mostrar en este periodo.</div>
            ) : (
              <ScatterChart
                height={360}
                colors={PALETTE}
                xAxis={[{ label: "Contratos (#)", min: 0 }]}
                yAxis={[{ label: "Ingresos (₡)", valueFormatter: (v) => crc(Number(v)) }]}
                series={[{
                  label: "Meses",
                  data: puntosCorr,
                  color: PALETTE[2],
                  valueFormatter: (p) =>
                    `${p?.id}\nContratos: ${intFmt(Number(p?.x))}\nIngresos: ${crc(Number(p?.y))}`,
                }]}
                margin={{ top: 24, right: 24, bottom: 56, left: 72 }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
