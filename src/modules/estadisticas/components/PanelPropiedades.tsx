/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import {
  useGetPropiedadesEstado,
  useGetPropiedadesTipoInmueble,
  useGetPropiedadesTop,
} from "../hooks/statsHooks";
import { currency } from "../utils/stats";

import { PALETTE } from "../utils/stats";

export function PanelPropiedades() {
  const {
    propiedadesEstado,
    loadingPropiedadesEstado,
    errorPropiedadesEstado,
  } = useGetPropiedadesEstado();

  const {
    errorPropiedadesTop,
    fetchingPropiedadesTop,
    propiedadesTop,
  } = useGetPropiedadesTop();

  const {
    errorPropiedadesTipoInmueble,
    loadingPropiedadesTipoInmueble,
    propiedadesTipoInmueble,
  } = useGetPropiedadesTipoInmueble();

  const loading =
    loadingPropiedadesEstado ||
    fetchingPropiedadesTop ||
    loadingPropiedadesTipoInmueble;

  const error =
    errorPropiedadesEstado ||
    errorPropiedadesTop ||
    errorPropiedadesTipoInmueble;

  const [verMonto, setVerMonto] = useState(false);

  const estadoLabels = useMemo(
    () => (propiedadesEstado ?? []).map((e) => e.EstadoPropiedad),
    [propiedadesEstado]
  );
  const estadoData = useMemo(
    () => (propiedadesEstado ?? []).map((e) => e.TotalPropiedades),
    [propiedadesEstado]
  );
  const estadoPie = useMemo(
    () =>
      (propiedadesEstado ?? []).map((e) => ({
        id: e.EstadoPropiedad,
        value: e.TotalPropiedades,
        label: e.EstadoPropiedad,
      })),
    [propiedadesEstado]
  );

  const topLabels = useMemo(
    () => (propiedadesTop ?? []).map((p) => p.Ubicacion),
    [propiedadesTop]
  );
  const topSerie = useMemo(
    () =>
      (propiedadesTop ?? []).map((p) =>
        verMonto ? p.TotalMonto ?? 0 : p.TotalContratos ?? 0
      ),
    [propiedadesTop, verMonto]
  );

  const tipoPie = useMemo(
    () =>
      (propiedadesTipoInmueble ?? []).map((d) => ({
        id: d.TipoInmueble,
        value: d.TotalContratos,
        label: d.TipoInmueble,
      })),
    [propiedadesTipoInmueble]
  );
  const totalTipo = useMemo(
    () => tipoPie.reduce((acc, it) => acc + (Number(it.value) || 0), 0),
    [tipoPie]
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
          <CardTitle>Estado de las propiedades</CardTitle>
          <CardDescription>
            Conteo de propiedades por su estado actual (disponible, reservado, vendido,
            etc.).
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(propiedadesEstado) ? (
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
                  data: estadoLabels,
                  label: "Estado",
                },
              ]}
              series={[
                { label: "Propiedades", data: estadoData, color: PALETTE[1] },
              ]}
              margin={{ top: 16, right: 16, bottom: 0, left: 26 }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Propiedades según tipo de inmueble</CardTitle>
          <CardDescription>
            Participación por tipo (casa, apartamento, lote, etc.) en los
            contratos asociados.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(tipoPie) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <PieChart
              height={320}
              colors={PALETTE}
              series={[
                {
                  data: tipoPie,
                  arcLabel: (item) =>
                    totalTipo > 0
                      ? `${Math.round(
                          (Number(item.value) / totalTipo) * 100
                        )}%`
                      : "0%",
                },
              ]}
              slotProps={{
                legend: {
                  position: { vertical: "bottom" },
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>
              Top propiedades más {verMonto ? "rentables" : "contratadas"} según su ubicación
            </CardTitle>
            <CardDescription>
              Ranking por {verMonto ? "ingresos generados" : "cantidad de contratos"}.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setVerMonto((v) => !v)}
          >
            {verMonto ? "Ver contratos" : "Ver monto"}
          </Button>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          {empty(propiedadesTop) ? (
            <div className="text-sm text-muted-foreground px-4 py-8">
              No hay datos para mostrar en este periodo.
            </div>
          ) : (
            <BarChart
              height={360}
              layout="horizontal"
              colors={PALETTE}
              yAxis={[{ scaleType: "band", data: topLabels, label: "Ubicación" }]}
              series={[
                {
                  label: verMonto ? "Monto total" : "Total contratos",
                  data: topSerie,
                  color: verMonto ? PALETTE[0] : PALETTE[4],
                },
              ]}
              xAxis={[
                {
                  label: verMonto ? "Monto en colones" : "Cantidad de contratos",
                  valueFormatter: (v) =>
                    verMonto ? currency(Number(v)) : `${v}`,
                },
              ]}
              margin={{ top: 16, right: 24, bottom: 0, left: 20 }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
