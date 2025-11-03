import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CardCliente from "@/modules/clientes/components/CardCliente";
import FormAgregarCliente from "@/modules/clientes/components/FormAgregarCliente";
import ClientesFiltros from "@/modules/clientes/components/ClientesFiltros";
import { FormEvent, useContext, useState } from "react";
import { ClientesFiltersProvider } from "@/modules/clientes/context/clientesFiltrosContextProvider";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClientesFiltersContext from "@/modules/clientes/context/clientesFiltersContext";
import { useClientesPaginatedFromContext } from "@/modules/clientes/hooks/usePaginationContext";
import { protectRoute } from "@/modules/seguridad/utils/authGuard";
import { Can } from "@/modules/seguridad/components/Can";

export const Route = createFileRoute("/clientes/")({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['AGENTE', 'ADMINISTRADOR', 'LECTOR'])
  },

  component: () => (
    <ClientesFiltersProvider>
      <RouteComponent />
    </ClientesFiltersProvider>
  ),
});

function RouteComponent() {
  const { filters, patchFilters } = useContext(ClientesFiltersContext);
  const { data, isLoading, isFetching, error } = useClientesPaginatedFromContext();

  const [inputQ, setInputQ] = useState(filters.q);

  const pageCount = data?.meta?.pageCount ?? 1;
  const canPrev = filters.page > 1;
  const canNext = filters.page < pageCount;

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
        <h1 className="text-4xl font-bold">Clientes</h1>
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
          <ClientesFiltros />
          <Can resource="clientes" action="create">
            <FormAgregarCliente />
          </Can>
        </div>
      </nav>

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
      {error && <div className="ml-16 text-destructive">Error cargando clientes.</div>}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div className="ml-16 text-muted-foreground">Sin resultados.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((client) => (
                <CardCliente key={client.identificacion} client={client} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Página {data.meta.page} de {data.meta.pageCount} · {data.meta.total} resultados
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={!canPrev} onClick={() => patchFilters({ page: filters.page - 1 })}>
                Anterior
              </Button>
              <Button variant="outline" disabled={!canNext} onClick={() => patchFilters({ page: filters.page + 1 })}>
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}