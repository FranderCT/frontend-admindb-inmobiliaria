/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDebounced } from "@/utils/debounce";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { useUpdateContract, useGetContractType, useGetAvailableProperties, useGetAgentPreview } from "../hooks/contractHooks";
import type { AgentPreview, AvailableProperty, ContractType, UpdateContract } from "../models/contract";

type Props = {
  initial: {
    idContrato: number;
    fechaInicio?: string;
    fechaFin?: string;
    fechaFirma?: string;
    fechaPago?: string;
    idTipoContrato?: number;
    idPropiedad?: number;
    idAgente?: number;
    montoTotal?: number;
    deposito?: number;
    porcentajeComision?: number;
    estado?: string | null;
    condiciones?: string[];
  };
  onSuccess?: () => void; 
};

const toTextBlock = (arr?: string[]) => (arr?.length ? arr.join("\n") : "");

export default function FormEditarContrato({ initial, onSuccess }: Props) {
  const update = useUpdateContract();
  const { contractTypes, loadingContractTypes } = useGetContractType();
  const { availableProperties, loadingAvailableProperties } = useGetAvailableProperties();

  const [cedulaAgente, setCedulaAgente] = useState("");
  const debouncedAgente = useDebounced(cedulaAgente.trim(), 450);
  const isSearching = debouncedAgente.length >= 3;
  const { agents = [], loadingAgents, fetchingAgents } = useGetAgentPreview(isSearching ? debouncedAgente : undefined);

  const opcionesAgentes = agents as AgentPreview[];
  const cargandoAgentesUI = loadingAgents || fetchingAgents;

  const defaults = useMemo(
    () => ({
      fechaInicio: initial.fechaInicio ?? "",
      fechaFin: initial.fechaFin ?? "",
      fechaFirma: initial.fechaFirma ?? "",
      fechaPago: initial.fechaPago ?? "",
      idTipoContrato: initial.idTipoContrato,
      idPropiedad: initial.idPropiedad,
      idAgente: initial.idAgente,
      montoTotal: initial.montoTotal ?? 0,
      deposito: initial.deposito ?? 0,
      porcentajeComision: initial.porcentajeComision ?? 0,
      estado: initial.estado ?? "",
      condicionesTexto: toTextBlock(initial.condiciones),
    }),
    [initial]
  );

  const diffPayload = (orig: typeof defaults, curr: typeof defaults): Partial<UpdateContract> => {
    const out: Partial<UpdateContract> = {};
    const pushIfChanged = <K extends keyof typeof curr>(k: K, map?: (v: any) => any) => {
      if (k === "condicionesTexto") return;
      const a = orig[k];
      const vb = map ? map(curr[k]) : curr[k];
      if (a !== vb) (out as any)[k] = vb;
    };

    pushIfChanged("fechaInicio");
    pushIfChanged("fechaFin");
    pushIfChanged("fechaFirma");
    pushIfChanged("fechaPago");
    pushIfChanged("idTipoContrato", Number);
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
    const same =
      origList.length === currList.length && origList.every((v, i) => v === currList[i]);
    if (!same) out.condiciones = currList;

    return out;
  };

  const form = useForm({
    defaultValues: defaults,
    onSubmit: async ({ value }) => {
      const pct = Number(value.porcentajeComision ?? 0);
      if (pct < 0 || pct > 100) {
        toast.error("% Comisión debe estar entre 0 y 100.");
        return;
      }
      if (!value.idTipoContrato) return toast.error("Selecciona un tipo de contrato.");
      if (!value.idPropiedad) return toast.error("Selecciona una propiedad.");
      if (!value.idAgente) return toast.error("Selecciona un agente.");

      const patch = diffPayload(defaults, value);
      if (Object.keys(patch).length === 0) {
        toast.message("No hay cambios para guardar.");
        return;
      }

      const payload: UpdateContract = { idContrato: initial.idContrato, ...patch };

      try {
        await update.mutateAsync({ contract: payload });
        toast.success("Contrato actualizado.");
        onSuccess?.(); // <- cierra el diálogo desde el padre
      } catch {
        toast.error("Error actualizando contrato.");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["fechaInicio", "fechaFin", "fechaFirma", "fechaPago"] as const).map((name) => (
          <form.Field key={name} name={name}>
            {(field) => (
              <div>
                <Label className="font-semibold">{name.replace("fecha", "Fecha ")}</Label>
                <Input type="date" value={field.state.value ?? ""} onChange={(e) => field.handleChange(e.target.value)} />
              </div>
            )}
          </form.Field>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="idTipoContrato">
          {(field) => (
            <div>
              <Label className="font-semibold">Tipo de contrato</Label>
              <Select
                value={field.state.value ? String(field.state.value) : ""}
                onValueChange={(v) => field.handleChange(Number(v))}
                disabled={loadingContractTypes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingContractTypes ? "Cargando..." : "Selecciona un tipo"} />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((t: ContractType) => (
                    <SelectItem key={t.idTipoContrato} value={String(t.idTipoContrato)}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field name="idPropiedad">
          {(field) => (
            <div>
              <Label className="font-semibold">Propiedad</Label>
              <Select
                value={field.state.value ? String(field.state.value) : ""}
                onValueChange={(v) => field.handleChange(Number(v))}
                disabled={loadingAvailableProperties}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingAvailableProperties ? "Cargando..." : "Selecciona una propiedad"} />
                </SelectTrigger>
                <SelectContent>
                  {availableProperties.map((p: AvailableProperty) => (
                    <SelectItem key={p.idPropiedad} value={String(p.idPropiedad)}>
                      {p.idPropiedad} - {p.ubicacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label className="font-semibold">Agente</Label>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="buscarAgente" className="text-sm">Buscar por cédula (mín. 3 dígitos)</Label>
            <Input id="buscarAgente" placeholder="Ej. 1 2345 6789" value={cedulaAgente} onChange={(e) => setCedulaAgente(e.target.value)} />
          </div>
          <Button type="button" variant="outline" onClick={() => setCedulaAgente("")}>Limpiar</Button>
        </div>

        <form.Field name="idAgente">
          {(field) => (
            <div>
              <Label className="text-sm mb-1">Seleccionar agente</Label>
              <Select
                value={field.state.value ? String(field.state.value) : ""}
                onValueChange={(v) => field.handleChange(Number(v))}
                disabled={cargandoAgentesUI}
              >
                <SelectTrigger>
                  <SelectValue placeholder={cargandoAgentesUI ? "Cargando agentes…" : "Selecciona un agente"} />
                </SelectTrigger>
                <SelectContent>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <form.Field name="montoTotal">
          {(field) => (
            <div>
              <Label className="font-semibold">Monto total</Label>
              <Input
                type="number" min={0} step="0.01"
                value={String(field.state.value ?? "")}
                onChange={(e) => field.handleChange(Number.isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber)}
                placeholder="Ej. 25000000"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="deposito">
          {(field) => (
            <div>
              <Label className="font-semibold">Depósito</Label>
              <Input
                type="number" min={0} step="0.01"
                value={String(field.state.value ?? "")}
                onChange={(e) => field.handleChange(Number.isNaN(e.currentTarget.valueAsNumber) ? 0 : e.currentTarget.valueAsNumber)}
                placeholder="Ej. 2500000"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="porcentajeComision">
          {(field) => (
            <div>
              <Label className="font-semibold">% Comisión</Label>
              <Input
                type="number" min={0} max={100} step="0.01"
                value={String(field.state.value ?? "")}
                onChange={(e) => {
                  const raw = e.currentTarget.valueAsNumber;
                  const v = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(100, raw));
                  field.handleChange(v);
                }}
                placeholder="Ej. 3.5"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="condicionesTexto">
        {(field) => (
          <div>
            <Label className="font-semibold">Condiciones (una por línea)</Label>
            <Textarea rows={4} value={field.state.value ?? ""} onChange={(e) => field.handleChange(e.target.value)}
              placeholder={`Ej.: El comprador paga antes del 30 de noviembre.\nLa propiedad se entrega en el estado actual.\nEl agente recibe comisión tras la factura.`}
            />
          </div>
        )}
      </form.Field>

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
