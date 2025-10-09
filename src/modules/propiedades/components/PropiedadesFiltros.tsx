import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useContext, useState } from "react";
//import { useGetPropertyStatuses, useGetPropertyTypes } from "../hooks/propiedadesHook";
import PropiedadesFiltersContext from "../context/propiedadesContext";

const PropiedadesFiltros = () => {
    const ctx = useContext(PropiedadesFiltersContext);
    const { filters, patchFilters, resetFilters } = ctx;

    const [open, setOpen] = useState(false);
    //const [hasOpened, setHasOpened] = useState(false);
    const [local, setLocal] = useState(filters);

    //const enabled = open || hasOpened;

    //const { propertyTypes, loadingPropertyTypes } = useGetPropertyTypes({ enabled });
    //const { propertyStatuses, loadingPropertyStatuses } = useGetPropertyStatuses({ enabled });

    //const propertyTypesData = useMemo(() => {
    //    if (Array.isArray(propertyTypes)) return propertyTypes;
    //    if (Array.isArray((propertyTypes as any)?.data)) return (propertyTypes as any).data;
    //    return [] as Array<{ idTipoInmueble: number; nombre: string }>;
    //}, [propertyTypes]);

    //const propertyStatusesData = useMemo(() => {
    //    if (Array.isArray(propertyStatuses)) return propertyStatuses;
    //    if (Array.isArray((propertyStatuses as any)?.data)) return (propertyStatuses as any).data;
    //    return [] as Array<{ idEstadoPropiedad: number; nombre: string }>;
    //}, [propertyStatuses]);

    if (!ctx) return null;
    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (v) {
            setHasOpened(true);
            setLocal(filters);
        }
    };

    const apply = () => {
        patchFilters({ ...local, page: 1 });
        setOpen(false);
    };

    const clear = () => {
        resetFilters();
        setLocal({
            ...filters,
            page: 1,
            limit: 9,
            sortCol: "idPropiedad",
            sortDir: "ASC",
            q: "",
            estado: undefined,
            estadoPropiedadId: undefined,
            tipoInmuebleId: undefined,
        });
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 flex flex-col">
                <div className="p-4 border-b">
                    <SheetHeader>
                        <SheetTitle className="font-semibold">Filtros avanzados</SheetTitle>
                    </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-neutral-500 scrollbar-track-transparent">
                    {/* Buscar */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Buscar</label>
                        <Input
                            placeholder="Ubicación, cliente, etc."
                            value={local.q}
                            onChange={(e) => setLocal((p) => ({ ...p, q: e.target.value }))}
                        />
                    </div>

                    {/* Estado activo/inactivo */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Estado (activo/inactivo)</label>
                        <Select
                            value={typeof local.estado === "number" ? String(local.estado) : "all"}
                            onValueChange={(v) =>
                                setLocal((p) => ({
                                    ...p,
                                    estado: v === "all" ? undefined : (Number(v) as 0 | 1),
                                }))
                            }
                        >
                            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Estado</SelectLabel>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="1">Activo</SelectItem>
                                    <SelectItem value="0">Inactivo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Orden / Dirección / Límite */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Ordenar por</label>
                        <Select
                            value={local.sortCol}
                            onValueChange={(v) => setLocal((p) => ({ ...p, sortCol: v as any }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Campo</SelectLabel>
                                    <SelectItem value="idPropiedad">ID</SelectItem>
                                    <SelectItem value="ubicacion">Ubicación</SelectItem>
                                    <SelectItem value="precio">Precio</SelectItem>
                                    <SelectItem value="estadoPropiedad">Estado Prop.</SelectItem>
                                    <SelectItem value="tipoInmueble">Tipo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Dirección</label>
                        <Select
                            value={local.sortDir}
                            onValueChange={(v) => setLocal((p) => ({ ...p, sortDir: v as "ASC" | "DESC" }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Dirección</SelectLabel>
                                    <SelectItem value="ASC">Ascendente</SelectItem>
                                    <SelectItem value="DESC">Descendente</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Por página</label>
                        <Select
                            value={String(local.limit)}
                            onValueChange={(v) => setLocal((p) => ({ ...p, limit: Number(v) }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Elementos</SelectLabel>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="9">9</SelectItem>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="24">24</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="p-4 border-t">
                    <SheetFooter className="flex gap-2 justify-end">
                        <Button onClick={apply}>Aplicar filtros</Button>
                        <Button variant="outline" onClick={clear}>Limpiar</Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default PropiedadesFiltros;
