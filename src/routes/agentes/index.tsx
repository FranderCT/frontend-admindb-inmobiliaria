import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useContext, useState } from "react";
import CardAgente from "@/modules/agentes/components/CardAgente";
import FormAgregarAgente from "@/modules/agentes/components/FormAgregarAgente";
import { useAgentesPaginatedFromContext } from "@/modules/agentes/hooks/usePaginationContext";
import AgentesFiltros from "@/modules/agentes/components/AgentesFiltros";
import { AgentesFiltersProvider } from "@/modules/agentes/context/agentesFiltrosContextProvider";
import AgentesFiltersContext from "@/modules/agentes/context/agentesFiltersContext";

export const Route = createFileRoute("/agentes/")({
  component: () => (
    <AgentesFiltersProvider>
      <RouteComponent />
    </AgentesFiltersProvider>
  ),
});

function RouteComponent() {
  const { filters, patchFilters } = useContext(AgentesFiltersContext);
  const { data, isLoading, isFetching, error } = useAgentesPaginatedFromContext();

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
          <FormAgregarAgente />
        </div>
      </nav>

      {(isLoading || (isFetching && !data)) && (
        <div className="ml-16">Cargando agentes...</div>
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
