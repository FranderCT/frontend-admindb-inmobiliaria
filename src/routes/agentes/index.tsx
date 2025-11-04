import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useContext, useMemo, useState } from "react";
import CardAgente from "@/modules/agentes/components/CardAgente";
import FormAgregarAgente from "@/modules/agentes/components/FormAgregarAgente";
import { useAgentesPaginatedFromContext } from "@/modules/agentes/hooks/usePaginationContext";
import AgentesFiltros from "@/modules/agentes/components/AgentesFiltros";
import { AgentesFiltersProvider } from "@/modules/agentes/context/agentesFiltrosContextProvider";
import AgentesFiltersContext from "@/modules/agentes/context/agentesFiltersContext";
import { protectRoute } from "@/modules/seguridad/utils/authGuard";
import { Can } from "@/modules/seguridad/components/Can";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetEstadisticasAgentes } from "@/modules/estadisticas/hooks/statsHooks";
import { currency } from "@/modules/estadisticas/utils/stats";
import TopAgentMedal from "@/modules/agentes/components/TopAgentMedal";

export const Route = createFileRoute("/agentes/")({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['ADMINISTRADOR', 'LECTOR'])
  },

  component: () => (
    <AgentesFiltersProvider>
      <RouteComponent />
    </AgentesFiltersProvider>
  ),
});

function RouteComponent() {
  const { filters, patchFilters } = useContext(AgentesFiltersContext);
  const { data, isLoading, isFetching, error } = useAgentesPaginatedFromContext();
      const { estadisticasAgentes } = useGetEstadisticasAgentes()

  const [inputQ, setInputQ] = useState(filters.q);

  const pageCount = data?.meta?.pageCount ?? 1;
  const canPrev = filters.page > 1;
  const canNext = filters.page <= pageCount;

  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    patchFilters({ q: inputQ.trim(), page: 1 });
  };

  const clearSearch = () => {
    setInputQ("");
    patchFilters({ q: "", page: 1 });
  };
  const topAgente = useMemo(() => {
    const arr = [...(estadisticasAgentes ?? [])]
    if (!arr.length) return { nombre: "—", comisiones: 0, contratos: 0 }
    arr.sort((a, b) => (b.TotalComisiones ?? 0) - (a.TotalComisiones ?? 0))
    const a0 = arr[0]
    return { nombre: a0.Agente, comisiones: a0.TotalComisiones ?? 0, contratos: a0.TotalContratos ?? 0 }
  }, [estadisticasAgentes])

  return (
    <section className="m-4">
      <header className="flex items-center justify-between mb-4 ml-16">
        <h1 className="text-4xl font-bold">Agentes</h1>
      </header>

      <nav className="flex flex-wrap gap-4 items-center justify-between mb-4 ml-16">
        <form onSubmit={onSubmitSearch} className="w-full md:w-1/2 flex gap-2">
          <Input
            name="q"
            placeholder="Buscar por cédula o nombre"
            value={inputQ}
            onChange={(e) => setInputQ(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" disabled={!inputQ.trim()}>
            Buscar
          </Button>
          {filters.q && (
            <Button type="button" variant="outline" onClick={clearSearch}>
              Limpiar
            </Button>
          )}
        </form>
        <div className="flex gap-4 justify-center items-center">
          <AgentesFiltros />
          <Can resource="agentes" action="create">
            <FormAgregarAgente />
          </Can>
        </div>
      </nav>
      <Card className="p-0 border-none shadow-none mb-4 ">
        <TopAgentMedal
          name={topAgente.nombre}
          commissionsCRC={currency(topAgente.comisiones)}
          contracts={topAgente.contratos}
        />
      </Card>

      {(isLoading || (isFetching && !data)) && (

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
            <Card key={k} className="h-[300px] w-70">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent className="px-2 pb-6">
                <Skeleton className="h-[190px] w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && <div className="ml-16 text-destructive">Error cargando agentes.</div>}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div className="ml-16 text-muted-foreground">Sin resultados.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((agent: any) => (
                <CardAgente key={agent.identificacion} agent={agent} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Página {data.meta.page} de {data.meta.pageCount} · {data.meta.total} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!canPrev}
                onClick={() => patchFilters({ page: filters.page - 1 })}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={!canNext}
                onClick={() => patchFilters({ page: filters.page + 1 })}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
