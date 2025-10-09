import { useContext, useEffect } from "react";
import { useGetClientsFiltered } from "./clientesHooks";
import ClientesFiltersContext from "../context/clientesFiltersContext";

export function useClientesPaginatedFromContext() {
  const { filters } = useContext(ClientesFiltersContext);
  const query = useGetClientsFiltered(filters);

  useEffect(() => {
    query.prefetchNext?.();
  }, [filters.page]);

  return query;
}