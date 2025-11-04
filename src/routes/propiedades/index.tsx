import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import CardPropiedad from "@/modules/propiedades/components/CardPropiedad";
import FormCrearTipoInmueble from "@/modules/propiedades/components/FormCrearTIpoInmueble";
import FormCrearPropiedad from "@/modules/propiedades/components/FormCrearPropiedad";
import PropiedadesFiltros from "@/modules/propiedades/components/PropiedadesFiltros";
import { PropiedadesFiltersProvider } from "@/modules/propiedades/context/propiedadesContextProvider";
import { usePropiedadesPaginatedFromContext } from "@/modules/propiedades/hooks/usePropiedadesFromContext";
import { useContext, useState } from "react";
import PropiedadesFiltersContext from "@/modules/propiedades/context/propiedadesContext";
import { protectRoute } from "@/modules/seguridad/utils/authGuard";
import { Can } from "@/modules/seguridad/components/Can";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PropiedadDetailPanel from "@/modules/propiedades/components/PanelDetallesPropiedad";

export const Route = createFileRoute("/propiedades/")({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['AGENTE', 'ADMINISTRADOR', 'LECTOR'])
  },

  component: () => (
    <PropiedadesFiltersProvider>
      <RouteComponent />
    </PropiedadesFiltersProvider>
  ),
});

function RouteComponent() {
  const ctx = useContext(PropiedadesFiltersContext);
  const { filters, patchFilters } = ctx;
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  const { data, isLoading, isFetching, error } = usePropiedadesPaginatedFromContext();

  if (!ctx) return null;
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
          <Can resource="propiedades" action="create">
            <FormCrearTipoInmueble />
          </Can>
          <Can resource="propiedades" action="create">
            <FormCrearPropiedad />
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
      {error && <div className="ml-16 text-destructive">Error cargando propiedades.</div>}

      {data && (
        <>
          {rows.length === 0 ? (
            <div className="ml-16 text-muted-foreground">Sin resultados.</div>
          ) : (
            <div className={`transition-all duration-300 ${selectedPropertyId
                ? "grid gap-6 grid-cols-1 md:w-1/2"
                : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              }`}>
              {rows.map((property) => (
                <CardPropiedad
                  key={property.idPropiedad}
                  property={property}
                  estadosPropiedad={[]}
                  tiposInmueble={[]}
                  onClick={() => {
                    console.log('Card clicked:', property.idPropiedad);
                    setSelectedPropertyId(property.idPropiedad);
                  }}
                />
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

      {/* Panel de detalles */}
      {selectedPropertyId && (
        <PropiedadDetailPanel
          idPropiedad={selectedPropertyId}
          onClose={() => setSelectedPropertyId(null)}
        />
      )}
    </div>
  );
}