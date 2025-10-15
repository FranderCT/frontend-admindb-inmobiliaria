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
import ClientesFiltersContext from "../context/clientesFiltersContext";

const ClientesFiltros = () => {
  const { filters, patchFilters, resetFilters } = useContext(ClientesFiltersContext);
  const [open, setOpen] = useState(false);

  const [local, setLocal] = useState(filters);

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
      page: 1, limit: 6, sortCol: "identificacion", sortDir: "ASC", q: "", estado: "1",
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 ">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[320px] sm:w-[380px] p-4">
        <SheetHeader>
          <SheetTitle className="font-semibold">Filtros avanzados</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 mt-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Buscar</label>
            <Input
              placeholder="Cédula o texto"
              value={local.q}
              onChange={(e) => setLocal((p) => ({ ...p, q: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={local.estado}
              onValueChange={(v) => setLocal((p) => ({ ...p, estado: v as "0" | "1" }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  <SelectItem value={undefined}>Todos</SelectItem>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Inactivo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Ordenar por</label>
            <Select
              value={local.sortCol}
              onValueChange={(v) => setLocal((p) => ({ ...p, sortCol: v }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Campo</SelectLabel>
                  <SelectItem value="identificacion">Identificación</SelectItem>
                  <SelectItem value="nombreCompleto">Nombre</SelectItem>
                  <SelectItem value="telefono">Teléfono</SelectItem>
                  <SelectItem value="estado">Estado</SelectItem>
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

        <SheetFooter className="mt-6 flex gap-2">
          <Button onClick={apply}>Aplicar filtros</Button>
          <Button variant="outline" onClick={clear}>Limpiar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ClientesFiltros;
