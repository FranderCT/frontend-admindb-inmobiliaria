import { createContext, Dispatch, SetStateAction } from "react";
import { AgentesFilters } from "../types/agentesContext";


type AgentesFiltersContextType = {
  filters: AgentesFilters;
  setFilters: Dispatch<SetStateAction<AgentesFilters>>;
  patchFilters: (patch: Partial<AgentesFilters>) => void;
  resetFilters: () => void;
};

const AgentesFiltersContext = createContext<AgentesFiltersContextType | null>(null);
export default AgentesFiltersContext;
