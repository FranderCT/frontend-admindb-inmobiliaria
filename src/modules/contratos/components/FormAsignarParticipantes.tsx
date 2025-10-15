import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, Dialog } from "@/components/ui/dialog";
import { useAssignContractParticipants, useGetContractRoleType } from "../hooks/contractHooks";
import { useGetClient, useGetClients } from "@/modules/clientes/hooks/clientesHooks";
import { ClientSearchPreview } from "@/modules/clientes/models/client";
import { useDebounced } from "@/utils/debounce";
import { RoleType } from "../models/contract";
import { assignParticipantsSchema } from "../schema/contractValidators";
import { FormAsignClientContractProps, ClientContractRow } from "../types/contractTypes";

export default function FormAsignarParticipantes({ idContrato, onSuccess, onCancel }: FormAsignClientContractProps) {
  const [rows, setRows] = useState<ClientContractRow[]>([]);
  const [cedulaQuery, setCedulaQuery] = useState<string>("");
  const assign = useAssignContractParticipants();
  const { contractRoleTypes = [], loadingContractRoleTypes, errorContractRoleTypes } = useGetContractRoleType();

  const debouncedCedula = useDebounced(cedulaQuery.trim(), 450);
  const enabledSearch = debouncedCedula.length >= 3;

  const {
    clientes: clientesListado = [],
    loadingClientes,
    fetchingClientes,
    errorClientes,
  } = useGetClients();

  const {
    cliente: clienteBuscado,
    loadingCliente,
    fetchingCliente,
    errorCliente,
  } = useGetClient(debouncedCedula, { enabled: enabledSearch });

  const usarBusqueda =
    enabledSearch &&
    !loadingCliente &&
    !fetchingCliente &&
    !errorCliente &&
    !!clienteBuscado;

  const opcionesClientes = useMemo(() => {
    if (usarBusqueda) {
      const arr = Array.isArray(clienteBuscado) ? clienteBuscado : [clienteBuscado];
      return arr.filter(Boolean) as ClientSearchPreview[];
    }
    return clientesListado as ClientSearchPreview[];
  }, [usarBusqueda, clienteBuscado, clientesListado]);

  const cargandoClientesUI =
    loadingClientes || fetchingClientes || (enabledSearch && (loadingCliente || fetchingCliente));

  const addRow = () => setRows((p) => [...p, {}]);
  const removeRow = (idx: number) => setRows((p) => p.filter((_, i) => i !== idx));
  const patchRow = (idx: number, patch: Partial<ClientContractRow>) => setRows((p) => p.map((r, i) => i === idx ? { ...r, ...patch } : r));

  const totalReady = rows.filter(r => r.identificacion && r.idRol).length;

  const handleSave = async () => {
    const participantes = rows
      .filter(r => r.identificacion && r.idRol)
      .map(r => ({
        identificacion: r.identificacion!,
        idRol: r.idRol!,
        idContrato, 
      }));

    const result = assignParticipantsSchema.safeParse({
      idContrato,
      participantes: participantes.map(({ identificacion, idRol }) => ({ identificacion, idRol })),
    });

    if (!result.success) {
      const first = result.error.issues[0];
      toast.error(first?.message ?? "Revisa los participantes antes de guardar.");
      return;
    }

    try {
      await assign.mutateAsync({ participantes });
      toast.success("Participantes asignados correctamente.");
      setRows([]);
      setCedulaQuery("");
      onSuccess?.();
    } catch (err) {
      toast.error("Error asignando participantes."+ err);
    }
  };

  return (
    <Dialog>
      <DialogHeader>
        <DialogTitle>Asignar participantes</DialogTitle>
        <DialogDescription>Contrato #{idContrato}. Agrega clientes y su rol en el contrato.</DialogDescription>
      </DialogHeader>

      <div className="space-y-2 rounded-md border p-3 mb-4">

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="buscarCedula" className="text-sm">Buscar por cédula (mín. 3 dígitos)</Label>
            <Input
              id="buscarCedula"
              placeholder="Ej. 1 2345 6789"
              value={cedulaQuery}
              onChange={(e) => setCedulaQuery(e.target.value)}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => setCedulaQuery("")}>
            Limpiar
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={addRow}><Plus/> Agregar fila</Button>
          <span className="text-sm text-muted-foreground">Completa cédula y rol por cada fila.</span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm opacity-70">Sin filas. Usa “Agregar fila”.</p>
        ) : (
          rows.map((row, idx) => (
            <div key={idx} className=" flex justify-between items-center">
              <div>
                <Label className="text-sm mb-1">Seleccionar cliente</Label>
                <Select
                  value={row.identificacion ? String(row.identificacion) : ""}
                  onValueChange={(v) => patchRow(idx, { identificacion: Number(v) })}
                  disabled={cargandoClientesUI}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        cargandoClientesUI
                          ? "Cargando clientes…"
                          : usarBusqueda
                            ? "Selecciona el cliente encontrado"
                            : "Selecciona un cliente"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {opcionesClientes?.length > 0 ? (
                      opcionesClientes.map((c) => (
                        <SelectItem key={c.identificacion} value={String(c.identificacion)}>
                          {c.nombreCompleto ??
                            [c.nombre, c.apellido1, c.apellido2].filter(Boolean).join(" ") ??
                            c.identificacion}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-1 text-sm opacity-70">
                        {enabledSearch
                          ? (errorCliente ? "Error al buscar por cédula." : "No se encontraron clientes.")
                          : (errorClientes ? "Error cargando clientes." : "Sin clientes para mostrar.")}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {(fetchingClientes || fetchingCliente) && (
                  <p className="text-xs opacity-60 mt-1">Actualizando lista…</p>
                )}
              </div>

              <div>
                <Label className="text-sm mb-1">Rol en el contrato</Label>
                <Select
                  value={row.idRol ? String(row.idRol) : ""}
                  onValueChange={(v) => patchRow(idx, { idRol: Number(v) })}
                  disabled={loadingContractRoleTypes}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingContractRoleTypes ? "Cargando roles…" : "Selecciona rol"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {errorContractRoleTypes && (
                      <div className="px-3 py-1 text-sm text-red-600">
                        Error al cargar roles.
                      </div>
                    )}
                    {(contractRoleTypes ?? []).map((r: RoleType) => (
                      <SelectItem key={r.idRol} value={String(r.idRol)}>
                        {r.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="destructive" onClick={() => removeRow(idx)}>
                  <Trash2 className="h-4 w-4" /> Quitar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <DialogFooter className="mt-4">
        <div className="mr-auto text-sm text-muted-foreground">
          Listas para guardar: <span className="font-medium">{totalReady}</span>
        </div>

        <Button
          variant="outline"
          onClick={() => setRows([])}
          disabled={assign.isPending || rows.length === 0}
        >
          Limpiar todo
        </Button>

        <Button
          onClick={handleSave}
          disabled={assign.isPending || totalReady === 0}
        >
          {assign.isPending ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando…</>) : "Guardar"}
        </Button>

        <Button variant="secondary" onClick={onCancel} disabled={assign.isPending}>
          Volver
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
