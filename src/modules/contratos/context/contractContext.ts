
import { createContext, Dispatch, SetStateAction } from "react";
import { ContratosFilters } from "../types/contractTypes";

type Ctx = {
    filters: ContratosFilters;
    setFilters: Dispatch<SetStateAction<ContratosFilters>>;
    patchFilters: (patch: Partial<ContratosFilters>) => void;
    resetFilters: () => void;
};

const ContratosFiltersContext = createContext<Ctx | null>(null);
export default ContratosFiltersContext;
