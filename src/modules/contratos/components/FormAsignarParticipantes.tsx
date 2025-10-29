import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, Dialog } from "@/components/ui/dialog";
import { useAssignContractParticipants, useGetContractPrev, useGetContractRoleType } from "../hooks/contractHooks";
import { useGetClient, useGetClients } from "@/modules/clientes/hooks/clientesHooks";
import { ClientSearchPreview } from "@/modules/clientes/models/client";
import { useDebounced } from "@/utils/debounce";
import { assignParticipantsSchema } from "../schema/contractValidators";
import { FormAsignClientContractProps } from "../types/contractTypes";
import { useGetPropertyById } from "@/modules/propiedades/hooks/propiedadesHook";

export default function FormAsignarParticipantes({
  idContrato,
  onSuccess,
  onCancel,
}: FormAsignClientContractProps) {
  const [cedulaQuery, setCedulaQuery] = useState<string>("");

  const { contrato, loadingContrato, fetchingContrato, errorContrato } =
    useGetContractPrev(idContrato, { enabled: !!idContrato });

  const esVenta = (contrato?.TipoContrato ?? "").toLowerCase() === "venta";

  const idPropiedad = contrato?.idPropiedad;
  const { propiedad, loadingProp, fetchingProp, errorProp } =
    useGetPropertyById(idPropiedad, { enabled: !!idPropiedad });

  const propietarioId = propiedad?.cliente?.identificacion;
  const propietarioNombre = propiedad
    ? [propiedad.cliente?.nombre, propiedad.cliente?.apellido1, propiedad.cliente?.apellido2]
      .filter(Boolean)
      .join(" ")
    : "";

  const { contractRoleTypes = [], loadingContractRoleTypes } = useGetContractRoleType();

  const roleIdByName = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of contractRoleTypes ?? []) {
      if (r?.nombre) map.set(r.nombre.trim().toLowerCase(), r.idRol);
    }
    return map;
  }, [contractRoleTypes]);

  const rolPropietarioId = esVenta
    ? roleIdByName.get("vendedor")
    : roleIdByName.get("arrendatario");

  const rolClienteId = esVenta
    ? roleIdByName.get("comprador")
    : roleIdByName.get("inquilino");

  const rolPropietarioNombre = esVenta ? "Vendedor" : "Arrendatario";
  const rolClienteNombre = esVenta ? "Comprador" : "Inquilino";

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
      return arr.filter(Boolean).filter(c => Number(c?.identificacion) !== Number(propietarioId)) as ClientSearchPreview[];
    }
    return (clientesListado as ClientSearchPreview[]).filter(c => Number(c?.identificacion) !== Number(propietarioId));
  }, [usarBusqueda, clienteBuscado, clientesListado, propietarioId]);

  const cargandoClientesUI =
    loadingClientes || fetchingClientes || (enabledSearch && (loadingCliente || fetchingCliente));

  const [clienteSel, setClienteSel] = useState<number | undefined>(undefined);

  useEffect(() => {
    setClienteSel(undefined);
    setCedulaQuery("");
  }, [idContrato, idPropiedad]);

  const assign = useAssignContractParticipants();

  const isLoadingAll =
    loadingContrato || fetchingContrato || loadingProp || fetchingProp || loadingContractRoleTypes;

  const handleSave = async () => {
    if (!idContrato || !propietarioId) {
      toast.error("No fue posible determinar propietario o contrato.");
      return;
    }
    if (!rolPropietarioId || !rolClienteId) {
      toast.error("No fue posible determinar los roles desde el servidor.");
      return;
    }
    if (!clienteSel) {
      toast.error(`Selecciona el ${rolClienteNombre.toLowerCase()}.`);
      return;
    }

    const participantes = [
      {
        identificacion: Number(propietarioId),
        idRol: Number(rolPropietarioId),
        idContrato,
      },
      {
        identificacion: Number(clienteSel),
        idRol: Number(rolClienteId),
        idContrato,
      },
    ];

    const result = assignParticipantsSchema.safeParse({
      idContrato,
      participantes: participantes.map(({ identificacion, idRol }) => ({
        identificacion: Number(identificacion),
        idRol: Number(idRol),
      })),
    });
    if (!result.success) {
      const first = result.error.issues[0];
      toast.error(first?.message ?? "Revisa los participantes antes de guardar.");
      return;
    }

    try {
      await assign.mutateAsync({
        participantes: participantes.map(({ identificacion, idRol, idContrato }) => ({
          identificacion: Number(identificacion),
          idRol: Number(idRol),
          idContrato,
        })),
      });
      toast.success("Participantes asignados correctamente.");
      setClienteSel(undefined);
      setCedulaQuery("");
      onSuccess?.();
    } catch (err) {
      toast.error("Error asignando participantes. " + err);
    }
  };

  return (
    <Dialog>
      <DialogHeader className="mb-2">
        <DialogTitle>Asignar participantes</DialogTitle>
        <DialogDescription>
          Contrato #{idContrato}. Completa los datos del propietario y del {rolClienteNombre.toLowerCase()}.
        </DialogDescription>
      </DialogHeader>

      {isLoadingAll && (
        <p className="text-sm opacity-70 flex items-center gap-2 mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando contrato/propiedad/roles…
        </p>
      )}
      {(errorContrato || errorProp) && (
        <p className="text-sm text-red-600 mb-3">
          No se pudo cargar {errorContrato ? "el contrato" : "la propiedad"}.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Propietario (readonly) */}
        <div className="rounded-md border p-3">
          <h4 className="font-semibold mb-2">Propietario</h4>
          <hr />
          <div className="space-y-2 mt-2">
            <div>
              <Label className="text-sm">Cédula</Label>
              <Input value={propietarioId ? String(propietarioId) : ""} disabled />
            </div>

            <div>
              <Label className="text-sm">Nombre completo</Label>
              <Input value={propietarioNombre ?? ""} disabled />
            </div>

            <div>
              <Label className="text-sm">Rol</Label>
              <Input value={rolPropietarioNombre} disabled />
            </div>
          </div>
        </div>

        <div className="rounded-md border p-3">
          <h4 className="font-semibold mb-2">{rolClienteNombre}</h4>
          <hr />

          <div className="space-y-2 mt-2 rounded-md border p-3">
            <Label htmlFor="buscarCedula" className="text-sm">
              Buscar por cédula
            </Label>
            <div className="flex items-end gap-2 w-full">
              <div className="w-96">
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
          </div>

          <div className="mt-3">
            <Label className="text-sm mb-1">Seleccionar {rolClienteNombre.toLowerCase()}</Label>
            <Select
              value={clienteSel ? String(clienteSel) : ""}
              onValueChange={(v) => setClienteSel(Number(v))}
              disabled={cargandoClientesUI}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    cargandoClientesUI
                      ? "Cargando clientes…"
                      : (enabledSearch ? "Selecciona el cliente encontrado" : "Selecciona un cliente")
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

            <div className="mt-3">
              <Label className="text-sm">Rol</Label>
              <Input value={rolClienteNombre} disabled />

            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button variant="secondary" onClick={onCancel} disabled={assign.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            assign.isPending ||
            !propietarioId ||
            !clienteSel ||
            !rolPropietarioId ||
            !rolClienteId
          }
        >
          {assign.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
