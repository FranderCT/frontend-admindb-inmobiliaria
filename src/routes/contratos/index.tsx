
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { protectRoute } from "@/modules/seguridad/utils/authGuard";
import { Can } from "@/modules/seguridad/components/Can";

import { useContext } from "react";
import ContratosFiltros from "@/modules/contratos/components/ContractFilters";
import ContratosFiltersContext from "@/modules/contratos/context/contractContext";
import { ContratosFiltersProvider } from "@/modules/contratos/context/contractContextProvider";
import { useContratosPaginatedFromContext } from "@/modules/contratos/hooks/useContractFilters";
import FormCrearContrato from "@/modules/contratos/components/FormCrearContrato";
import CardPreviewContrato from "@/modules/contratos/components/CardPreviewContrato";

export const Route = createFileRoute("/contratos/")({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ["AGENTE", "ADMINISTRADOR", "LECTOR"]);
  },
  component: () => (
    <ContratosFiltersProvider>
      <RouteComponent />
    </ContratosFiltersProvider>
  ),
});

function RouteComponent() {
  const { data, isLoading, isFetching, error } = useContratosPaginatedFromContext();
  const ctx = useContext(ContratosFiltersContext);
  if (!ctx) return null;

  const { filters, patchFilters } = ctx;

  const pageCount = data?.meta?.pageCount ?? 1;
  const canPrev = filters.page > 1;
  const canNext = filters.page < pageCount;
  const rows = Array.isArray(data?.data) ? data!.data : [];

  return (
    <div className="m-4">
      <header className="flex items-center justify-between mb-4 ml-16">
        <h1 className="text-4xl font-bold">Contratos</h1>
      </header>

      <nav className="flex flex-wrap gap-4 items-center justify-end mb-4 ml-16">
        <div className="flex gap-4 justify-center items-center">
          <ContratosFiltros />
          <Can resource="contratos" action="create">
            <FormCrearContrato />
          </Can>
        </div>
      </nav>

      {(isLoading || (isFetching && !data)) && (
        <div className="ml-16">Cargando contratos...</div>
      )}
      {error && <div className="ml-16 text-destructive">Error cargando contratos.</div>}

      {data && (
        <>
          {rows.length === 0 ? (
            <div className="ml-16 text-muted-foreground">Sin resultados.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {rows.map((c) => <CardPreviewContrato key={c.idContrato} contract={c} />)}
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
    </div>
  );
}
