import { PropsWithChildren, useState, useCallback, useMemo } from "react";
import { ContratosFilters } from "../types/contractTypes";
import ContratosFiltersContext from "./contractContext";

const DEFAULT_FILTERS: ContratosFilters = {
  page: 1,
  limit: 10,
  sortCol: "fechaInicio",
  sortDir: "ASC",
  q: "",
  estado: undefined, 
  tipoContratoId: undefined,
  agenteId: undefined,
};

export function ContratosFiltersProvider({ children }: PropsWithChildren) {
  const [filters, setFilters] = useState<ContratosFilters>(DEFAULT_FILTERS);

  const patchFilters = useCallback((patch: Partial<ContratosFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const value = useMemo(
    () => ({ filters, setFilters, patchFilters, resetFilters }),
    [filters, patchFilters, resetFilters]
  );

  return (
    <ContratosFiltersContext.Provider value={value}>
      {children}
    </ContratosFiltersContext.Provider>
  );
}
