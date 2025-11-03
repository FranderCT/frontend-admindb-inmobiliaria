import { useMemo } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { currency, monthIndex, monthsLabels, PALETTE } from "../utils/stats";
import {
  useGetContratoEstado,
  useGetContratosMes,
  useGetContratosTipo,
} from "../hooks/statsHooks";
import { vistaContratosPorTipo } from "../model/reportes";


const PanelContratos = () => {
  const {
    estadisticasContratosMes,
    loadingEstadisticasContratosMes,
    errorEstadisticasContratosMes,
  } = useGetContratosMes();

  const {
    contratosTipo,
    loadingContratosTipo,
    errorContratosTipo,
  } = useGetContratosTipo();

  const {
    estadisticasContratoEstado,
    loadingEstadisticasContratoEstado,
    errorEstadisticasContratoEstado,
  } = useGetContratoEstado();

  const error =
    errorEstadisticasContratosMes ||
    errorContratosTipo ||
    errorEstadisticasContratoEstado;

  const loading =
    loadingEstadisticasContratosMes ||
    loadingContratosTipo ||
    loadingEstadisticasContratoEstado;

  const seriesContratosLinea = useMemo(() => {
    const porAnio: Record<string, number[]> = {};
    (estadisticasContratosMes ?? []).forEach((m) => {
      const idx = monthIndex[(m.NombreMes || "").toLowerCase()];
      if (idx == null || idx < 0) return;
      const anio = String(m.Anio ?? "");
      porAnio[anio] ||= new Array(12).fill(0);
      porAnio[anio][idx] += m.TotalContratos;
    });
    return Object.entries(porAnio)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([anio, data], i) => ({
        label: anio,
        data,
        color: PALETTE[i % PALETTE.length],
      }));
  }, [estadisticasContratosMes]);

  const barMontoMes = useMemo(() => {
    if (!estadisticasContratosMes?.length)
      return [{ label: "Monto total", data: new Array(12).fill(0), color: PALETTE[0] }];
    const years = Array.from(
      new Set(estadisticasContratosMes.map((m) => Number(m.Anio)))
    ).sort((a, b) => a - b);
    const latest = years[years.length - 1];
    const arr = new Array(12).fill(0);
    estadisticasContratosMes
      .filter((m) => Number(m.Anio) === latest)
      .forEach((m) => {
        const idx = monthIndex[(m.NombreMes || "").toLowerCase()];
        if (idx != null && idx >= 0) arr[idx] += m.MontoTotal;
      });
    return [{ label: `Monto total ${latest}`, data: arr, color: PALETTE[0] }];
  }, [estadisticasContratosMes]);

  const pieDataContratos = useMemo(
    () =>
      contratosTipo?.map((d: vistaContratosPorTipo) => ({
        id: d.TipoContrato,
        value: d.TotalContratos,
        label: d.TipoContrato,
      })) ?? [],
    [contratosTipo]
  );

  const pieEstado = useMemo(
    () =>
      (estadisticasContratoEstado ?? []).map((e) => ({
        id: e.EstadoContrato,
        value: e.TotalContratos,
        label: e.EstadoContrato,
      })),
    [estadisticasContratoEstado]
  );

  const totalPieEstado = useMemo(
    () => pieEstado.reduce((acc, it) => acc + (Number(it.value) || 0), 0),
    [pieEstado]
  );
  const totalPieTipo = useMemo(
    () => pieDataContratos.reduce((acc, it) => acc + (Number(it.value) || 0), 0),
    [pieDataContratos]
  );

  const empty = (arr?: any[]) => !arr || arr.length === 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((k) => (
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
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Contratos por mes</CardTitle>
          <CardDescription>
            Evolución mensual de la cantidad de contratos en el año actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(estadisticasContratosMes) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <LineChart
              height={320}
              colors={PALETTE}
              xAxis={[{ scaleType: "point", data: monthsLabels, label: "Mes" }]}
              series={seriesContratosLinea}
              yAxis={[{ label: "Cantidad de contratos" }]}
              margin={{ top: 16, right: 16, bottom: 22, left: 20 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Monto total por mes </CardTitle>
          <CardDescription>
            Ingresos agregados por mes del último año disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(estadisticasContratosMes) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <BarChart
              height={300}
              colors={PALETTE}
              xAxis={[{ scaleType: "band", data: monthsLabels, label: "Mes" }]}
              series={barMontoMes}
              yAxis={[{ label: "Monto en colones (₡)", valueFormatter: (v) => currency(Number(v)) }]}
              margin={{ top: 16, right: 16, bottom: 0, left: 20 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Proporción de contratos por estado</CardTitle>
          <CardDescription>
            Distribución del total de contratos según su estado actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(pieEstado) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <PieChart
              height={300}
              colors={PALETTE}
              series={[
                {
                  data: pieEstado,
                  arcLabel: (item) =>
                    totalPieEstado > 0
                      ? `${Math.round((Number(item.value) / totalPieEstado) * 100)}%`
                      : "0%",
                },
              ]}
              slotProps={{
                legend: { position: { vertical: "bottom" } },
              }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribución por tipo de contrato</CardTitle>
          <CardDescription>
            Participación por tipo (venta, alquiler, etc.) sobre el total de contratos.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(pieDataContratos) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <PieChart
              height={300}
              colors={PALETTE}
              series={[
                {
                  data: pieDataContratos,
                  arcLabel: (item) =>
                    totalPieTipo > 0
                      ? `${Math.round((Number(item.value) / totalPieTipo) * 100)}%`
                      : "0%",
                },
              ]}
              slotProps={{
                legend: {position: { vertical: "bottom"} },
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelContratos;
