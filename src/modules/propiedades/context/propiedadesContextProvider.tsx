import { useState } from "react";
import PropiedadesFiltersContext from "./propriedadesContext";
import { PropiedadesProviderType, PropiedadesFilters, defaultFilters } from "../types/propiedadesContext";


export function PropiedadesFiltersProvider({ children }: PropiedadesProviderType) {
    const [filters, setFilters] = useState<PropiedadesFilters>(defaultFilters);

    const patchFilters = (patch: Partial<PropiedadesFilters>) =>
        setFilters((prev) => ({ ...prev, ...patch }));

    const resetFilters = () => setFilters(defaultFilters);

    return (
        <PropiedadesFiltersContext.Provider
            value={{ filters, setFilters, patchFilters, resetFilters }}
        >
            {children}
        </PropiedadesFiltersContext.Provider>
    );
}