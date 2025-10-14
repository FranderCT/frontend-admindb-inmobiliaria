import { useContext, useEffect } from "react";
import AgentesFiltersContext from "../context/agentesFiltersContext";
import { useGetAgentsFiltered } from "./agentesHooks";

export function useAgentesPaginatedFromContext() {
  const { filters } = useContext(AgentesFiltersContext);
  const query = useGetAgentsFiltered(filters);

  useEffect(() => {
    query.prefetchNext?.();
  }, [filters.page]); 

  return query;
}
