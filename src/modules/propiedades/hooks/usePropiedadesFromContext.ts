import { useContext, useEffect } from "react";
import { useGetPropertiesFiltered } from "./propiedadesHook";
import PropiedadesFiltersContext from "@/modules/propiedades/context/propiedadesContext";

export function usePropiedadesPaginatedFromContext() {
    const ctx = useContext(PropiedadesFiltersContext);
    if (!ctx) throw new Error("PropiedadesFiltersProvider faltante");
    const { filters } = ctx;

    const query = useGetPropertiesFiltered(filters);

    useEffect(() => {
        // si quieres prefetch de siguiente página
        // query.prefetchNext?.();
    }, [filters.page]);

    return query;
}