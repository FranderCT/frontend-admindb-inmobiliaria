import { useState } from "react";
import { PropiedadesFilters, PropiedadesProviderType, defaultFilters } from "../types/propiedadesContext";
import PropiedadesFiltersContext from "./propiedadesContext";

export function PropiedadesFiltersProvider({ children }: PropiedadesProviderType) {
    const [filters, setFilters] = useState<PropiedadesFilters>(defaultFilters);
    const patchFilters = (patch: Partial<PropiedadesFilters>) => setFilters(p => ({ ...p, ...patch }));
    const resetFilters = () => setFilters(defaultFilters);

    return (
        <PropiedadesFiltersContext.Provider value={{ filters, setFilters, patchFilters, resetFilters }}>
            {children}
        </PropiedadesFiltersContext.Provider>
    );
}