import { useContext, useEffect } from "react";
import { useGetClientesPaginate } from "./clientesHooks";
import ClientesFiltersContext from "../context/clientesFiltersContext";

export function useClientesPaginatedFromContext() {
  const { filters } = useContext(ClientesFiltersContext);
  const query = useGetClientesPaginate(filters);

  useEffect(() => {
    query.prefetchNext?.();
  }, [filters.page]);

  return query;
}