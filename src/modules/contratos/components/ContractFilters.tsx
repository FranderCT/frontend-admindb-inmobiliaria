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
import ContratosFiltersContext from "../context/contractContext";

const ContratosFiltros = () => {
  const ctx = useContext(ContratosFiltersContext);
  const [open, setOpen] = useState(false);
  const { filters, patchFilters, resetFilters } = ctx;
  const [local, setLocal] = useState(filters);
  if (!ctx) return null;


  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) setLocal(filters);
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
      limit: 10,
      sortCol: "fechaInicio",
      sortDir: "ASC",
      q: "",
      estado: undefined,
      tipoContratoId: undefined,
      agenteId: undefined,
      propiedadId: undefined,
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
          <div className="grid gap-2">
            <label className="text-sm font-medium">Buscar</label>
            <Input
              placeholder="Cliente, propiedad, agente..."
              value={local.q}
              onChange={(e) => setLocal((p) => ({ ...p, q: e.target.value }))}
            />
          </div>

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

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tipo de contrato</label>
            <Input
              placeholder="ID tipo (ej. 1)"
              value={local.tipoContratoId ?? ""}
              onChange={(e) =>
                setLocal((p) => ({
                  ...p,
                  tipoContratoId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Agente</label>
            <Input
              placeholder="ID agente"
              value={local.agenteId ?? ""}
              onChange={(e) =>
                setLocal((p) => ({
                  ...p,
                  agenteId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Propiedad</label>
            <Input
              placeholder="ID propiedad"
              value={local.propiedadId ?? ""}
              onChange={(e) =>
                setLocal((p) => ({
                  ...p,
                  propiedadId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>

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
                  <SelectItem value="fechaInicio">Fecha inicio</SelectItem>
                  <SelectItem value="fechaFin">Fecha fin</SelectItem>
                  <SelectItem value="fechaFirma">Fecha firma</SelectItem>
                  <SelectItem value="montoTotal">Monto total</SelectItem>
                  <SelectItem value="idContrato">ID contrato</SelectItem>
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
                  <SelectItem value="10">10</SelectItem>
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

export default ContratosFiltros;
