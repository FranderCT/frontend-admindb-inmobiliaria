import { useContext, useEffect } from "react";
import AgentesFiltersContext from "../context/agentesFiltersContext";
import { useGetAgentsFiltered } from "./agentesHooks";

export function useAgentesPaginatedFromContext() {
  const { filters } = useContext(AgentesFiltersContext);
  const query = useGetAgentsFiltered(filters);

  // Mantengo tu lógica exacta: si existe prefetchNext, la invoca al cambiar la página.
  useEffect(() => {
    query.prefetchNext?.();
  }, [filters.page]); // eslint-disable-line react-hooks/exhaustive-deps

  return query;
}
