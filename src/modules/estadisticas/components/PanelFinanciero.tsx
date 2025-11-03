/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { crc, groupBy, monthIndex, monthsLabels, PALETTE } from "../utils/stats";
import {
  useGetContratosMes,
  useGetContratosTipo,
  useGetEstadisticasAgentes,
} from "../hooks/statsHooks";
import { vistaContratosPorTipo } from "../model/reportes";


const PanelFinanciero = () => {
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
    estadisticasAgentes,
    loadingEstadisticasAgentes,
    errorEstadisticasAgentes,
  } = useGetEstadisticasAgentes();

  const error =
    errorEstadisticasContratosMes ||
    errorEstadisticasAgentes ||
    errorContratosTipo;

  const loading =
    loadingEstadisticasContratosMes ||
    loadingEstadisticasAgentes ||
    loadingContratosTipo;

  const porAnio = useMemo(
    () => groupBy(estadisticasContratosMes ?? [], (d) => d.Anio),
    [estadisticasContratosMes]
  );

  const seriesComisiones = useMemo(() => {
    return Object.entries(porAnio).map(([anio, rows], i) => {
      const arr = new Array(12).fill(0);
      (rows as any[]).forEach((r) => {
        const idx = monthIndex[(r.NombreMes || "").toLowerCase()] ?? -1;
        if (idx >= 0) arr[idx] = r.MontoTotal;
      });
      return { label: String(anio), data: arr, color: PALETTE[i % PALETTE.length] };
    });
  }, [porAnio]);

  const puntosAgentes = useMemo(
    () =>
      (estadisticasAgentes ?? []).map((a: any) => ({
        x: a.TotalContratos,
        y: a.TotalComisiones,
        size: Math.max(6, Math.sqrt(Math.abs(a.PromedioMontoContrato)) / 2000),
        id: a.Agente,
      })),
    [estadisticasAgentes]
  );

  const seriesIngresosMes = useMemo(() => {
    const arr = new Array(12).fill(0);
    (estadisticasContratosMes ?? []).forEach((m: any) => {
      const idx = monthIndex[(m.NombreMes || "").toLowerCase()];
      if (idx >= 0) arr[idx] += m.MontoTotal;
    });
    return [{ label: "Monto total", data: arr, color: PALETTE[0] }];
  }, [estadisticasContratosMes]);

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

  const empty = (arr?: any[]) => !arr || arr.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Ingresos acumulados por tipo de contrato</CardTitle>
          <CardDescription>
            Distribución del monto total generado por cada tipo de contrato
            (venta, alquiler, etc.). 
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(contratosTipo) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <BarChart
              height={300}
              colors={PALETTE}
              xAxis={[
                {
                  scaleType: "band",
                  data: contratosTipo?.map((d: vistaContratosPorTipo) => d.TipoContrato) ?? [],
                  label: "Tipo de contrato",
                },
              ]}
              series={[
                {
                  label: "Monto total",
                  data: contratosTipo?.map((d: vistaContratosPorTipo) => d.MontoTotal) ?? [],
                  color: PALETTE[2],
                },
              ]}
              yAxis={[
                {
                  label: "Monto en colones (₡)",
                  valueFormatter: (v) => crc(Number(v)),
                },
              ]}
              margin={{ top: 16, right: 16, bottom: 0, left: 34 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Evolución mensual de comisiones por año</CardTitle>
          <CardDescription>
            Tendencia en los valores de las comisiones mes a mes.
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
              xAxis={[
                { scaleType: "point", data: monthsLabels, label: "Mes" },
              ]}
              series={seriesComisiones}
              yAxis={[
                {
                  label: "Monto comisionado en colones (₡)",
                  valueFormatter: (v) => crc(Number(v)),
                },
              ]}
              margin={{ top: 16, right: 16, bottom: 40, left: 60 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Productividad por agente: contratos vs comisiones</CardTitle>
          <CardDescription>
            Relación entre el volumen de contratos y el total de comisiones por
            agente. 
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(estadisticasAgentes) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <ScatterChart
              height={360}
              colors={PALETTE}
              xAxis={[{ label: "Total de contratos", min: 0 }]}
              yAxis={[
                {
                  label: "Monto comisionado en colones (₡)",
                  valueFormatter: (v) => crc(Number(v)),
                },
              ]}
              series={[
                {
                  label: "Agentes",
                  data: puntosAgentes,
                  color: PALETTE[4],
                  valueFormatter: (p) =>
                    `${p?.id}\nContratos: ${p?.x}\nComisiones: ${crc(
                      Number(p?.y)
                    )}`,
                },
              ]}
              margin={{ top: 24, right: 44, bottom: 0, left: 32 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Ingresos totales por mes</CardTitle>
          <CardDescription>
            Monto agregado generado por contratos en cada mes del año. Útil para
            planificar metas y proyecciones financieras.
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
              series={seriesIngresosMes}
              yAxis={[
                {
                  label: "Ingresos (₡)",
                  valueFormatter: (v) => crc(Number(v)),
                },
              ]}
              margin={{ top: 16, right: 16, bottom: 40, left: 64 }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelFinanciero;
