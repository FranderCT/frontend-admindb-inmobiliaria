/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { BarChart, ScatterChart } from "@mui/x-charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEstadisticasAgentes } from "@/modules/estadisticas/hooks/statsHooks";

const currency = (v: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(v);

const integer = (v: number) => new Intl.NumberFormat("es-CR").format(v);

import { PALETTE } from "../utils/stats";

export function PanelAgentes() {
  const {
    estadisticasAgentes,
    loadingEstadisticasAgentes,
    errorEstadisticasAgentes,
  } = useGetEstadisticasAgentes();
  const [q, setQ] = useState("");

  const data = useMemo(() => estadisticasAgentes ?? [], [estadisticasAgentes]);

  const agentes = useMemo(() => {
    const base = [...data].sort((a, b) => b.TotalComisiones - a.TotalComisiones);
    if (!q.trim()) return base;
    const n = q.toLowerCase();
    return base.filter((a) => a.Agente.toLowerCase().includes(n));
  }, [data, q]);

  const topLabels = agentes.map((a) => a.Agente);
  const serieVolumen = agentes.map((a) => a.TotalContratos);
  const serieCierres = agentes.map((a) => a.ContratosFinalizados);

  const puntosScatter = agentes.map((a) => ({
    x: a.TotalContratos,
    y: a.TotalComisiones,
    size: Math.max(6, Math.sqrt(Math.abs(a.PromedioMontoContrato || 0)) / 2000),
    id: a.Agente,
  }));

  const empty = (arr?: any[]) => !arr || arr.length === 0;

  if (loadingEstadisticasAgentes) {
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

  if (errorEstadisticasAgentes) {
    return (
      <div className="text-sm text-red-600 px-4 py-8">
        Ocurrió un problema obteniendo las estadísticas. Intenta nuevamente.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Ranking por comisiones</CardTitle>
              <CardDescription>
                Agentes ordenados por comisiones generadas en colones.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {empty(agentes) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
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
                          {typeof a.ContratosFinalizados === "number" && (
                            <span className="ml-2">
                              · {integer(a.ContratosFinalizados)} finalizados
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold">
                        {currency(a.TotalComisiones)}
                      </div>
                      <div className="text-xs text-muted-foreground">comisiones</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Volumen VS cierres por agente</CardTitle>
          <CardDescription>
            Comparativa entre contratos creados y finalizados por agente.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(agentes) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <BarChart
              height={340}
              colors={PALETTE}
              xAxis={[{ scaleType: "band", data: topLabels, label: "Agente" }]}
              series={[
                { data: serieVolumen, label: "Total contratos", color: PALETTE[0] },
                {
                  data: serieCierres,
                  label: "Contratos finalizados",
                  color: PALETTE[5],
                },
              ]}
              margin={{ top: 16, right: 16, bottom: 0, left: 20 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Cantidad de contratos firmados VS ingresos por comisiones</CardTitle>
          <CardDescription>
            Relación entre número de contratos y comisiones generadas. El tamaño
            del punto sugiere el promedio del monto por contrato.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(agentes) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <ScatterChart
              height={360}
              colors={PALETTE}
              xAxis={[{ label: "Total contratos", min: 0 }]}
              yAxis={[
                {
                  label: "Total comisiones (₡)",
                  valueFormatter: (v) => currency(Number(v)),
                },
              ]}
              series={[
                {
                  label: "Agentes",
                  data: puntosScatter,
                  color: PALETTE[2],
                  valueFormatter: (p) =>
                    `${p?.id}\nContratos: ${integer(
                      Number(p?.x)
                    )}\nComisiones: ${currency(Number(p?.y))}`,
                },
              ]}
              margin={{ top: 24, right: 44, bottom: 26, left: 22 }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
