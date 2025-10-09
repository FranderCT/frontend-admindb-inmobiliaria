import { useContext, useEffect } from "react";
import { useGetPropertiesFiltered } from "./propiedadesHook";
import PropiedadesFiltersContext from "../context/propriedadesContext";

export function usePropiedadesPaginatedFromContext() {
  const { filters } = useContext(PropiedadesFiltersContext);
  const query = useGetPropertiesFiltered(filters);

  useEffect(() => {
  }, [filters.page]);

  return query;
}