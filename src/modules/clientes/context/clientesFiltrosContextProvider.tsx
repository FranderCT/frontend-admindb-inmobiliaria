import { useState } from "react";
import { ClientesFilters, ClientsProviderType, defaultFilters } from "../types/clientesContext";
import ClientesFiltersContext from "./clientesFiltersContext";

export function ClientesFiltersProvider({ children }: ClientsProviderType) {
  const [filters, setFilters] = useState<ClientesFilters>(defaultFilters);

  const patchFilters = (patch: Partial<ClientesFilters>) =>
    setFilters(prev => ({ ...prev, ...patch }));

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <ClientesFiltersContext.Provider value={{ filters, setFilters, patchFilters, resetFilters }}>
      {children}
    </ClientesFiltersContext.Provider>
  );
}
