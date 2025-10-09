import { Dispatch, SetStateAction, createContext } from "react";
import { PropiedadesFilters } from "../types/propiedadesContext";

type PropiedadesFiltersContextType = {
    filters: PropiedadesFilters;
    setFilters: Dispatch<SetStateAction<PropiedadesFilters>>;
    patchFilters: (patch: Partial<PropiedadesFilters>) => void;
    resetFilters: () => void;
};

const PropiedadesFiltersContext = createContext<PropiedadesFiltersContextType | null>(null);
export default PropiedadesFiltersContext;
