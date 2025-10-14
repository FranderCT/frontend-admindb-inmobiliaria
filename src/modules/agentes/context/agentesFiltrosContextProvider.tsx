import { useState } from "react";
import AgentesFiltersContext from "./agentesFiltersContext";
import { AgentesFilters, AgentesProviderType, defaultFilters } from "../types/agentesContext";

export function AgentesFiltersProvider({ children }: AgentesProviderType) {
  const [filters, setFilters] = useState<AgentesFilters>(defaultFilters);

  const patchFilters = (patch: Partial<AgentesFilters>) =>
    setFilters(prev => ({ ...prev, ...patch }));

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <AgentesFiltersContext.Provider value={{ filters, setFilters, patchFilters, resetFilters }}>
      {children}
    </AgentesFiltersContext.Provider>
  );
}
