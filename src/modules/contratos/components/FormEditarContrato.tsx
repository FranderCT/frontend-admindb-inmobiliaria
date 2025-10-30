/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDebounced } from "@/utils/debounce";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";
import {
  useUpdateContract,
  useGetAvailableProperties,
  useGetAgentPreview,
  useGetContract,
} from "../hooks/contractHooks";
import type { AgentPreview, UpdateContract } from "../models/contract";
import { EditContractProps } from "../types/contractTypes";

const toTextBlock = (arr?: { textoCondicion: string }[] | string[]) =>
  Array.isArray(arr)
    ? (typeof arr[0] === "string"
      ? (arr as string[]).join("\n")
      : (arr as { textoCondicion: string }[]).map(c => c.textoCondicion).join("\n"))
    : "";

const toDateInput = (v?: string | null): string => {
  if (!v) return "";
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

export default function FormEditarContrato({ initialIdContrato, onSuccess }: EditContractProps) {
  // Hooks SIEMPRE en el tope
  const { contract: defaultValuesContrato, loadingContract } = useGetContract(initialIdContrato);
  const update = useUpdateContract();
  const { availableProperties = [], loadingAvailableProperties } = useGetAvailableProperties();

  // Agentes
  const [cedulaAgente, setCedulaAgente] = useState("");
  const debouncedAgente = useDebounced(cedulaAgente.trim(), 450);
  const isSearching = debouncedAgente.length >= 3;
  const { agents = [], loadingAgents, fetchingAgents } = useGetAgentPreview(
    isSearching ? debouncedAgente : undefined
  );
  const opcionesAgentes = agents as AgentPreview[];
  const cargandoAgentesUI = loadingAgents || fetchingAgents;

  // Flag de carga y contrato seguro (puede estar undefined al primer render)
  const isLoading = loadingContract || !defaultValuesContrato;
  const contrato = defaultValuesContrato ?? ({} as any);

  // Defaults SIEMPRE definidos (vacíos si no hay contrato aún)
  const defaults = useMemo(
    () => ({
      fechaInicio: toDateInput(contrato.fechaInicio),
      fechaFin: toDateInput(contrato.fechaFin),
      fechaFirma: toDateInput(contrato.fechaFirma),
      fechaPago: toDateInput(contrato.fechaPago),
      idPropiedad: contrato.idPropiedad ?? 0,
      idAgente: contrato.idAgente ?? 0,
      montoTotal: contrato.montoTotal ?? 0,
      deposito: contrato.deposito ?? 0,
      porcentajeComision: contrato.porcentajeComision ?? 0,
      estado: contrato.estado ?? "",
      condicionesTexto: toTextBlock(contrato.condiciones),
    }),
    // OJO: depende del objeto contrato (que cambia cuando llega el GET)
    [contrato]
  );

  // Form SIEMPRE se crea una vez con defaults (aunque sean vacíos)
  const form = useForm({
    defaultValues: defaults,
    onSubmit: async ({ value }) => {
      const pct = Number(value.porcentajeComision ?? 0);
      if (pct < 0 || pct > 100) {
        toast.error("% Comisión debe estar entre 0 y 100.");
        return;
      }
      if (!value.idPropiedad) return toast.error("Falta el id de la propiedad.");
      if (!value.idAgente) return toast.error("Selecciona un agente.");

      const patch = diffPayload(defaults, value);
      if (Object.keys(patch).length === 0) {
        toast.message("No hay cambios para guardar.");
        return;
      }

      const payload: UpdateContract = { idContrato: contrato.idContrato, ...patch };
      try {
        await update.mutateAsync({ contract: payload });
        toast.success("Contrato actualizado.");
        onSuccess?.();
      } catch {
        toast.error("Error actualizando contrato.");
      }
    },
  });

  // Cuando LLEGUE el contrato, reseteamos el form con los defaults correctos
  useEffect(() => {
    if (!isLoading) {
      form.reset(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, defaults]);

  // Visibilidad de campos de fecha SIN romper reglas de hooks
  const isVenta = contrato?.tipoContrato === "Venta";
  const isAlquiler = contrato?.tipoContrato === "Alquiler";

  // Propiedad (solo lectura) con preferencia por el objeto anidado del GET
  const propiedadTexto = contrato?.propiedad
    ? `${contrato.propiedad.idPropiedad} - ${contrato.propiedad.ubicacion}`
    : (() => {
      const p = availableProperties.find((x) => x.idPropiedad === contrato.idPropiedad);
      return p
        ? `${p.idPropiedad} - ${p.ubicacion}`
        : contrato.idPropiedad
          ? String(contrato.idPropiedad) + (loadingAvailableProperties ? " (cargando…)" : "")
          : "";
    })();

  // Fallback para agente seleccionado si no aparece en el listado actual
  const selectedAgenteId = form.state.values.idAgente;
  const selectedExists = opcionesAgentes.some((a) => a.identificacion === Number(selectedAgenteId));
  const fallbackAgenteLabel = selectedAgenteId ? String(selectedAgenteId) : "";

  // Si quieres, muestra un overlay visual de carga (pero SIN cortar hooks):
  // Podrías deshabilitar inputs cuando isLoading sea true.
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Propiedad (solo lectura) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="font-semibold">Propiedad</Label>
          <Input value={propiedadTexto} disabled readOnly />
          <input type="hidden" value={form.state.values.idPropiedad} />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isVenta && (
          <form.Field name="fechaFirma">
            {(field) => (
              <div>
                <Label className="font-semibold">Fecha firma</Label>
                <Input
                  type="date"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
          </form.Field>
        )}

        {isAlquiler && (
          <>
            <form.Field name="fechaInicio">
              {(field) => (
                <div>
                  <Label className="font-semibold">Fecha inicio</Label>
                  <Input
                    type="date"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="fechaFin">
              {(field) => (
                <div>
                  <Label className="font-semibold">Fecha fin</Label>
                  <Input
                    type="date"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="fechaPago">
              {(field) => (
                <div>
                  <Label className="font-semibold">Fecha pago</Label>
                  <Input
                    type="date"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </form.Field>
          </>
        )}
      </div>

      {/* Agente */}
      <div className="space-y-2 rounded-md border p-3">
        <Label className="font-semibold">Agente</Label>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="buscarAgente" className="text-sm">
              Buscar por cédula (mín. 3 dígitos)
            </Label>
            <Input
              id="buscarAgente"
              placeholder="Ej. 1 2345 6789"
              value={cedulaAgente}
              onChange={(e) => setCedulaAgente(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => setCedulaAgente("")} disabled={isLoading}>
            Limpiar
          </Button>
        </div>

        <form.Field name="idAgente">
          {(field) => (
            <div>
              <Label className="text-sm mb-1">Seleccionar agente</Label>
              <Select
                value={field.state.value ? String(field.state.value) : ""}
                onValueChange={(v) => field.handleChange(Number(v))}
                disabled={cargandoAgentesUI || isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      cargandoAgentesUI
                        ? "Cargando agentes…"
                        : isSearching
                          ? "Selecciona el agente encontrado"
                          : "Selecciona un agente"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!selectedExists && selectedAgenteId && (
                    <SelectItem value={String(selectedAgenteId)}>{fallbackAgenteLabel}</SelectItem>
                  )}
                  {(opcionesAgentes as AgentPreview[]).map((a) => (
                    <SelectItem key={a.identificacion} value={String(a.identificacion)}>
                      {a.nombreCompleto ?? String(a.identificacion)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fetchingAgents && <p className="text-xs opacity-60 mt-1">Actualizando lista…</p>}
            </div>
          )}
        </form.Field>
      </div>

      {/* Montos / Comisión */}
      <div className={`grid grid-cols-1 ${isAlquiler ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
        <form.Field name="montoTotal">
          {(field) => (
            <div>
              <Label className="font-semibold">Monto total</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={String(field.state.value ?? "")}
                onChange={(e) =>
                  field.handleChange(
                    Number.isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber
                  )
                }
                placeholder="Ej. 25000000"
                disabled={isLoading}
              />
            </div>
          )}
        </form.Field>

        {isAlquiler && (
          <form.Field name="deposito">
            {(field) => (
              <div>
                <Label className="font-semibold">Depósito</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={String(field.state.value ?? "")}
                  onChange={(e) =>
                    field.handleChange(
                      Number.isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber
                    )
                  }
                  placeholder="Ej. 2500000"
                  disabled={isLoading}
                />
              </div>
            )}
          </form.Field>
        )}

        <form.Field name="porcentajeComision">
          {(field) => (
            <div>
              <Label className="font-semibold">% Comisión al agente</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={String(field.state.value ?? "")}
                onChange={(e) => {
                  const raw = e.currentTarget.valueAsNumber;
                  const v = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(100, raw));
                  field.handleChange(v);
                }}
                placeholder="Ej. 3.5"
                disabled={isLoading}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Condiciones */}
      <form.Field name="condicionesTexto">
        {(field) => (
          <div>
            <Label className="font-semibold">Condiciones (una por línea)</Label>
            <Textarea
              rows={4}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={`Ej.: El comprador paga antes del 30 de noviembre.\nLa propiedad se entrega en el estado actual.\nEl agente recibe comisión tras la factura.`}
              disabled={isLoading}
            />
          </div>
        )}
      </form.Field>

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={update.isPending || isLoading}>
          {update.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

// ---- fuera del componente ----
function diffPayload(orig: any, curr: any): Partial<UpdateContract> {
  const out: Partial<UpdateContract> = {};
  const pushIfChanged = (k: string, map?: (v: any) => any) => {
    if (k === "condicionesTexto") return;
    const a = orig[k];
    const vb = map ? map(curr[k]) : curr[k];
    if (a !== vb) (out as any)[k] = vb;
  };

  pushIfChanged("fechaInicio");
  pushIfChanged("fechaFin");
  pushIfChanged("fechaFirma");
  pushIfChanged("fechaPago");
  pushIfChanged("idPropiedad", Number);
  pushIfChanged("idAgente", Number);
  pushIfChanged("montoTotal", Number);
  pushIfChanged("deposito", Number);
  pushIfChanged("porcentajeComision", Number);
  pushIfChanged("estado", (v) => (v === "" ? null : v));

  const norm = (s?: string) =>
    (s || "")
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
  const origList = norm(orig.condicionesTexto);
  const currList = norm(curr.condicionesTexto);
  const same = origList.length === currList.length && origList.every((v, i) => v === currList[i]);
  if (!same) (out as any).condiciones = currList;

  return out;
}
