import { useContext, useEffect } from "react";
import { useGetContracts } from "./contractHooks";
import ContratosFiltersContext from "../context/contractContext";

export function useContratosPaginatedFromContext() {
  const ctx = useContext(ContratosFiltersContext);
  if (!ctx) throw new Error("ContratosFiltersProvider faltante");

  const { filters } = ctx;
  const query = useGetContracts(filters);

  useEffect(() => {
  }, [filters.page]);

  return query;
}
