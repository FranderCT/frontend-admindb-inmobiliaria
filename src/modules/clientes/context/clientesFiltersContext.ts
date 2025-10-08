import { createContext } from "react";
import { ClientesFilters } from "../types/clientesContext";

type ClientesFiltersContextType = {
  filters: ClientesFilters;
  setFilters: React.Dispatch<React.SetStateAction<ClientesFilters>>;
  patchFilters: (patch: Partial<ClientesFilters>) => void;
  resetFilters: () => void;
};

const ClientesFiltersContext = createContext<ClientesFiltersContextType | null>(null);
export default ClientesFiltersContext;
