import { Dispatch, SetStateAction, createContext } from "react";
import { PropiedadesFilters } from "../types/propiedadesContext";

type Ctx = {
    filters: PropiedadesFilters;
    setFilters: Dispatch<SetStateAction<PropiedadesFilters>>;
    patchFilters: (patch: Partial<PropiedadesFilters>) => void;
    resetFilters: () => void;
};

const PropiedadesFiltersContext = createContext<Ctx | null>(null);
export default PropiedadesFiltersContext;