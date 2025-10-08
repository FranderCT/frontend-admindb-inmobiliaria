import { createContext, Dispatch, SetStateAction } from "react";
import { ClientesFilters } from "../types/clientesContext";

type ClientesFiltersContextType = {
  filters: ClientesFilters;
  setFilters: Dispatch<SetStateAction<ClientesFilters>>;
  patchFilters: (patch: Partial<ClientesFilters>) => void;
  resetFilters: () => void;
};

const ClientesFiltersContext = createContext<ClientesFiltersContextType | null>(null);
export default ClientesFiltersContext;
