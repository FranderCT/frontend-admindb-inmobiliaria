import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import CardPropiedad from "@/modules/propiedades/components/CardPropiedad";
import FormCrearEstadoPropiedad from "@/modules/propiedades/components/FormCrearEstadoPropiedad";
import FormCrearTipoInmueble from "@/modules/propiedades/components/FormCrearTIpoInmueble";
import FormCrearPropiedad from "@/modules/propiedades/components/FormCrearPropiedad";
import PropiedadesFiltros from "@/modules/propiedades/components/PropiedadesFiltros";
import { PropiedadesFiltersProvider } from "@/modules/propiedades/context/propiedadesContextProvider";
import { usePropiedadesPaginatedFromContext } from "@/modules/propiedades/hooks/usePropiedadesFromContext";
import { useContext } from "react"
import PropiedadesFiltersContext from "@/modules/propiedades/context/propiedadesContext";

export const Route = createFileRoute("/propiedades/")({
  component: () => (
    <PropiedadesFiltersProvider>
      <RouteComponent />
    </PropiedadesFiltersProvider>
  ),
});

function RouteComponent() {
  const ctx = useContext(PropiedadesFiltersContext);
  const { filters, patchFilters } = ctx;

  const { data, isLoading, isFetching, error } = usePropiedadesPaginatedFromContext();

  if (!ctx) return null;                       // 👈 valida ANTES de desestructurar
  const pageCount = data?.meta?.pageCount ?? 1;
  const canPrev = filters.page > 1;
  const canNext = filters.page < pageCount;

  const rows = Array.isArray(data?.data) ? data!.data : [];

  return (
    <div className="m-4">
      <header className="flex items-center justify-between mb-4 ml-16">
        <h1 className="text-4xl font-bold">Propiedades</h1>
      </header>

      <nav className="flex flex-wrap gap-4 items-center justify-end mb-4 ml-16">
        <div className="flex gap-4 justify-center items-center">
          <PropiedadesFiltros />
          <FormCrearEstadoPropiedad />
          <FormCrearTipoInmueble />
          <FormCrearPropiedad />
        </div>
      </nav>

      {(isLoading || (isFetching && !data)) && (
        <div className="ml-16">Cargando propiedades...</div>
      )}
      {error && <div className="ml-16 text-destructive">Error cargando propiedades.</div>}

      {data && (
        <>
          {rows.length === 0 ? (
            <div className="ml-16 text-muted-foreground">Sin resultados.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((property) => (
                <CardPropiedad key={property.idPropiedad} property={property} />
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
    </div>
  );
}
