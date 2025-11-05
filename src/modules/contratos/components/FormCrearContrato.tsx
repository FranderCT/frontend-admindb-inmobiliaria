import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Plus, Loader2, UserRound, FileText, Landmark, Users } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { extractServerErrors } from "@/utils/serverExtract";
import { useDebounced } from "@/utils/debounce";
import {
  useCreateContract,
  useGetAgentPreview,
  useGetAvailableProperties,
  useGetContractType,
} from "../hooks/contractHooks";
import FormAsignarParticipantes from "./FormAsignarParticipantes";

import {
  AgentPreview,
  AvailableProperty,
  CreateContract,
} from "../models/contract";

import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/animate-ui/components/headless/dialog";
import Stepper, { StepDef } from "@/modules/app/components/Stepper";
import { datosVentaSchema, datosAlquilerSchema, mapIssuesByField, prettyIssue, MAX_MONEY, MAX_PERCENT, clampMoney } from "../schema/contractValidators";
import { addMonthsISO } from "../utils/date";
import { toTextBlock } from "../utils/contrtact";


type WizardStep = "tipo" | "datos" | "condiciones" | "assign";
type TipoContratoLocal = "venta" | "alquiler" | null;
const steps: StepDef[] = [
  { key: "tipo", label: "Tipo", Icon: UserRound },
  { key: "datos", label: "Datos", Icon: FileText },
  { key: "condiciones", label: "Condiciones", Icon: Landmark },
  { key: "assign", label: "Participantes", Icon: Users },
];

const hoyISO = () => new Date().toISOString().slice(0, 10);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const condicionesArray = (value.condicionesTexto ?? "")
  .split("\n")
  .map(t => t.trim())
  .filter(Boolean);

export default function FormCrearContrato() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>("tipo");
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoContratoLocal>(null);
  const [createdContractId, setCreatedContractId] = useState<number | null>(null);

  const { availableProperties, loadingAvailableProperties } = useGetAvailableProperties();
  const { contractTypes, loadingContractTypes } = useGetContractType();
  const [cedulaAgente, setCedulaAgente] = useState<string>("");
  const debouncedAgente = useDebounced(cedulaAgente.trim(), 450);
  const isSearching = debouncedAgente.length >= 3;
  const {
    agents: agentes = [],
    loadingAgents,
    fetchingAgents,
    errorAgents,
  } = useGetAgentPreview(isSearching ? debouncedAgente : undefined);
  const cargandoAgentesUI = loadingAgents || fetchingAgents;

  const idsPorNombre = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of contractTypes ?? []) {
      map.set((t.nombre || "").toLowerCase(), t.idTipoContrato);
    }
    return map;
  }, [contractTypes]);

  const create = useCreateContract();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

  const pruneUndefined = <T extends Record<string, any>>(obj: T): T => {
    const out: Record<string, any> = {};
    for (const k in obj) {
      if (obj[k] !== undefined) out[k] = obj[k];
    }
    return out as T;
  };

  const form = useForm({
    defaultValues: {
      fechaInicio: hoyISO(),
      fechaFin: hoyISO(),
      fechaFirma: hoyISO(),
      fechaPago: hoyISO(),
      idTipoContrato: 0 as number,
      idPropiedad: 0 as number,
      idAgente: 0 as number,
      montoTotal: 0 as number,
      deposito: 0 as number,
      porcentajeComision: 0 as number,
      condicionesTexto: toTextBlock([]),
      cantidadPagos: 12 as number,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({});
      setFormError(null);

      try {
        const isVenta = tipoSeleccionado === "venta";
        const isAlquiler = tipoSeleccionado === "alquiler";

        const base: CreateContract = {
          idTipoContrato: Number(value.idTipoContrato),
          idPropiedad: Number(value.idPropiedad),
          idAgente: Number(value.idAgente),
          montoTotal: Number(value.montoTotal),
          deposito: Number(value.deposito),
          porcentajeComision: Number(value.porcentajeComision),
          estado: null,
          condiciones: condicionesArray, 
        };

        const payload: CreateContract = pruneUndefined({
          ...base,

          fechaFirma: value.fechaFirma || undefined,

          ...(isAlquiler && {
            fechaInicio: value.fechaInicio || undefined,
            fechaFin: addMonthsISO(value.fechaInicio, Number(value.cantidadPagos || 0)) || undefined,
            fechaPago: value.fechaPago || undefined,
            cantidadPagos: Number(value.cantidadPagos || 0),
          }),

          ...(isVenta && {
            fechaInicio: undefined,
            fechaFin: undefined,
            fechaPago: undefined,
            cantidadPagos: undefined,
          }),
        });

        if (!payload.idTipoContrato) return toast.error("Selecciona el tipo de contrato.");
        if (!payload.idPropiedad) return toast.error("Selecciona una propiedad.");
        if (!payload.idAgente) return toast.error("Selecciona un agente.");

        const creado = await create.mutateAsync({ contract: payload });
        const id = Number(creado?.idContrato);
        if (!id || Number.isNaN(id)) throw new Error("No se recibió id del contrato.");

        setCreatedContractId(id);
        setStep("assign");
        toast.success("Contrato creado. Ahora asigna participantes.");
      } catch (err) {
        const { fieldErrors, formError } = extractServerErrors(err);
        setFormErrors(fieldErrors);
        setFormError(formError ?? "Error creando contrato.");
      }
    },
  });


  useEffect(() => {
    if (!tipoSeleccionado) return;
    const nombre = tipoSeleccionado === "venta" ? "venta" : "alquiler";
    const id = idsPorNombre.get(nombre);
    if (id) {
      form.setFieldValue("idTipoContrato", id);
    }
  }, [tipoSeleccionado, idsPorNombre]); // eslint-disable-line

  const fechaFinCalculada = useMemo(() => {
    if (tipoSeleccionado !== "alquiler") return form.state.values.fechaFin || "";
    const n = Number(form.state.values.cantidadPagos || 0);
    return addMonthsISO(form.state.values.fechaInicio, Number.isFinite(n) ? n : 0);
  }, [tipoSeleccionado, form.state.values.fechaInicio, form.state.values.cantidadPagos, form.state.values.fechaFin]);

  const resetAll = () => {
    setStep("tipo");
    setTipoSeleccionado(null);
    setCreatedContractId(null);
    setFormErrors({});
    setFormError(null);
    setZodErrors({});
    setCedulaAgente("");
    form.reset();
  };

  const { canContinueDatos, validationErrors } = useMemo(() => {
    if (!tipoSeleccionado) return { canContinueDatos: false, validationErrors: {} };

    const schema = tipoSeleccionado === "venta" ? datosVentaSchema : datosAlquilerSchema;
    const result = schema.safeParse(form.state.values);

    if (result.success) return { canContinueDatos: true, validationErrors: {} };
    return { canContinueDatos: false, validationErrors: mapIssuesByField(result.error.issues) };
  }, [
    tipoSeleccionado,
    form.state.values.fechaFirma,
    form.state.values.fechaPago,
    form.state.values.idPropiedad,
    form.state.values.idAgente,
    form.state.values.montoTotal,
    form.state.values.porcentajeComision,
    form.state.values.fechaInicio,
    form.state.values.cantidadPagos,
    form.state.values.deposito,
  ]);


  const validateField = (fieldName: string, value: any) => {
    if (!tipoSeleccionado) return;

    const schema = tipoSeleccionado === "venta" ? datosVentaSchema : datosAlquilerSchema;
    const fieldSchema = (schema as any).shape?.[fieldName];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value); 
    if (result.success) {
      setZodErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    } else {
      const first = result.error.issues[0];
      setZodErrors((prev) => ({
        ...prev,
        [fieldName]: prettyIssue(first, fieldName),
      }));
    }
  };


  const isScrollStep = step === "datos";

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus /> Crear contrato
      </Button>

      <Dialog
        open={open}
        onClose={(v) => {
          setOpen(Boolean(v));
          if (!v) resetAll();
        }}
      >
        <DialogPanel
          className="
            max-h-[92vh] 
            w-full rounded-2xl p-0
            flex flex-col
          "
        >
          <DialogHeader
            className="
              sticky top-0
              border-b py-2 px-4
            "
          >
            <DialogTitle>
              Crear contrato {tipoSeleccionado === "venta" ? "de venta" : tipoSeleccionado === "alquiler" ? "de alquiler" : ""}
            </DialogTitle>
            <DialogDescription>
              {step === "tipo" && "Selecciona el tipo de contrato para continuar."}
              {step === "datos" && "Completa los datos del contrato."}
              {step === "condiciones" && "Agrega condiciones (una por línea) y envía."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 pt-2 pb-3 border-b">
            <Stepper steps={steps} currentKey={step} />
          </div>

          <div
            className={
              isScrollStep
                ? "flex-1 overflow-y-auto px-4 pr-6 pt-3 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700 scrollbar-track-gray-100"
                : "px-4 pr-6 pt-3 pb-4"
            }
          >
            {step === "tipo" && (
              <div className="space-y-4 py-2 w-full">
                <Label className="font-semibold">Tipo de contrato</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={tipoSeleccionado === "venta" ? "default" : "outline"}
                    onClick={() => setTipoSeleccionado("venta")}
                  >
                    Venta
                  </Button>
                  <Button
                    type="button"
                    variant={tipoSeleccionado === "alquiler" ? "default" : "outline"}
                    onClick={() => setTipoSeleccionado("alquiler")}
                  >
                    Alquiler
                  </Button>
                </div>

                {loadingContractTypes && (
                  <p className="text-xs text-muted-foreground">
                    Cargando tipos del servidor…
                  </p>
                )}

                <DialogFooter className="mt-4">
                  <DialogClose>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={() => setStep("datos")}
                    disabled={!tipoSeleccionado}
                  >
                    Continuar
                  </Button>
                </DialogFooter>
              </div>
            )}
            {step === "datos" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canContinueDatos) {
                    setStep("condiciones");
                  } else {
                    toast.error("Revisa los campos requeridos.");
                  }
                }}
                className="space-y-4 "
              >
                {tipoSeleccionado === "venta" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="fechaFirma">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Fecha de firma</Label>
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={() => validateField("fechaFirma", field.state.value)}
                            />
                            {zodErrors.fechaFirma && <p className="text-red-700 text-sm">{zodErrors.fechaFirma}</p>}
                            {formErrors.fechaFirma && <p className="text-red-700 text-sm">{formErrors.fechaFirma}</p>}
                          </div>
                        )}
                      </form.Field>
                      <form.Field name="idPropiedad">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Propiedad</Label>
                            <Select
                              value={field.state.value ? String(field.state.value) : ""}
                              onValueChange={(v) => {
                                const numValue = Number(v);
                                field.handleChange(numValue);
                                validateField("idPropiedad", numValue);
                              }}
                              disabled={loadingAvailableProperties}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={loadingAvailableProperties ? "Cargando..." : "Selecciona una propiedad"} />
                              </SelectTrigger>
                              <SelectContent>
                                {(availableProperties ?? []).length > 0 ? (
                                  (availableProperties ?? []).map((p: AvailableProperty) => (
                                    <SelectItem key={p.idPropiedad} value={String(p.idPropiedad)}>
                                      {p.idPropiedad} - {p.ubicacion}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="px-3 py-1 text-sm opacity-70">
                                    {loadingAvailableProperties ? "Cargando propiedades..." : "No hay propiedades disponibles."}
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            {zodErrors.idPropiedad && <p className="text-red-700 text-sm">{zodErrors.idPropiedad}</p>}
                            {formErrors.idPropiedad && <p className="text-red-700 text-sm">{formErrors.idPropiedad}</p>}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <div className="space-y-2 rounded-md border p-3">
                      <Label className="font-semibold">Asignar agente</Label>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Label htmlFor="buscarAgente" className="text-sm">Buscar por cédula (mín. 3 dígitos)</Label>
                          <Input
                            id="buscarAgente"
                            placeholder="Ej. 1 2345 6789"
                            value={cedulaAgente}
                            onChange={(e) => setCedulaAgente(e.target.value)}
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={() => setCedulaAgente("")}>
                          Limpiar
                        </Button>
                      </div>

                      <form.Field name="idAgente">
                        {(field) => {
                          const selectedId = field.state.value ? Number(field.state.value) : undefined;
                          const selectedExists = selectedId
                            ? agentes.some((a) => a.identificacion === selectedId)
                            : false;
                          const fallbackLabel = selectedId ? String(selectedId) : "";

                          return (
                            <div>
                              <Label className="text-sm mb-1">Seleccionar agente</Label>
                              <Select
                                value={selectedId ? String(selectedId) : ""}
                                onValueChange={(v) => {
                                  const numValue = Number(v);
                                  field.handleChange(numValue);
                                  validateField("idAgente", numValue);
                                }}
                                disabled={cargandoAgentesUI}
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
                                  {!selectedExists && selectedId && (
                                    <SelectItem value={String(selectedId)}>{fallbackLabel}</SelectItem>
                                  )}
                                  {agentes.length > 0 ? (
                                    agentes.map((a: AgentPreview) => (
                                      <SelectItem key={a.identificacion} value={String(a.identificacion)}>
                                        {a.nombreCompleto ?? String(a.identificacion)}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-3 py-1 text-sm opacity-70">
                                      {errorAgents ? "Error cargando agentes." : "Sin agentes para mostrar."}
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                              {zodErrors.idAgente && <p className="text-red-700 text-sm mt-1">{zodErrors.idAgente}</p>}
                              {formErrors.idAgente && <p className="text-red-700 text-sm mt-1">{formErrors.idAgente}</p>}
                            </div>
                          );
                        }}
                      </form.Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex w-55">
                        <form.Field name="porcentajeComision">
                          {(field) => (
                            <div>
                              <Label className="font-semibold">% Comisión al agente</Label>
                              <Input
                                type="number"
                                min={0}
                                max={MAX_PERCENT}
                                step="0.01"
                                value={String(field.state.value ?? "")}
                                onChange={(e) => {
                                  const raw = e.currentTarget.valueAsNumber;
                                  const v = Number.isNaN(raw) ? 0 : clamp(raw, 0, MAX_PERCENT);
                                  field.handleChange(v);
                                }}
                                onBlur={() => validateField("porcentajeComision", field.state.value)}
                                placeholder="Ej. 3.5"
                              />
                              {zodErrors.porcentajeComision && <p className="text-red-700 text-sm">{zodErrors.porcentajeComision}</p>}
                              {formErrors.porcentajeComision && <p className="text-red-700 text-sm">{formErrors.porcentajeComision}</p>}
                            </div>
                          )}
                        </form.Field>
                      </div>


                      <form.Field name="montoTotal">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Monto total</Label>
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              max={MAX_MONEY}
                              value={String(field.state.value ?? "")}
                              onChange={(e) => field.handleChange(clampMoney(e.currentTarget.valueAsNumber))}
                              placeholder="Ej. 250000.00"
                            />
                            {zodErrors.montoTotal && <p className="text-red-700 text-sm">{zodErrors.montoTotal}</p>}
                            {formErrors.montoTotal && <p className="text-red-700 text-sm">{formErrors.montoTotal}</p>}
                          </div>
                        )}
                      </form.Field>

                    </div>
                  </>
                )}

                {tipoSeleccionado === "alquiler" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <form.Field name="fechaInicio">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Fecha Inicio</Label>
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={() => validateField("fechaInicio", field.state.value)}
                            />
                            {zodErrors.fechaInicio && <p className="text-red-700 text-sm">{zodErrors.fechaInicio}</p>}
                            {formErrors.fechaInicio && <p className="text-red-700 text-sm">{formErrors.fechaInicio}</p>}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="cantidadPagos">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Cantidad de pagos</Label>
                            <Input
                              type="number"
                              step="1"
                              value={String(field.state.value ?? 0)}
                              onChange={(e) => {
                                const raw = e.currentTarget.valueAsNumber;
                                field.handleChange(Number.isNaN(raw) ? 0 : Math.max(0, Math.floor(raw)));
                              }}
                              onBlur={() => validateField("cantidadPagos", field.state.value)}
                              placeholder="Ej. 12"
                            />
                            {zodErrors.cantidadPagos && <p className="text-red-700 text-sm">{zodErrors.cantidadPagos}</p>}
                          </div>
                        )}
                      </form.Field>

                      <div>
                        <Label className="font-semibold">Fecha Fin </Label>
                        <Input type="date" value={fechaFinCalculada} disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="fechaFirma">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Fecha de firma</Label>
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={() => validateField("fechaFirma", field.state.value)}
                            />
                            {zodErrors.fechaFirma && <p className="text-red-700 text-sm">{zodErrors.fechaFirma}</p>}
                            {formErrors.fechaFirma && <p className="text-red-700 text-sm">{formErrors.fechaFirma}</p>}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="fechaPago">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Fecha a pagar</Label>
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={() => validateField("fechaPago", field.state.value)}
                            />
                            {zodErrors.fechaPago && <p className="text-red-700 text-sm">{zodErrors.fechaPago}</p>}
                            {formErrors.fechaPago && <p className="text-red-700 text-sm">{formErrors.fechaPago}</p>}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <div >
                      <form.Field name="idPropiedad">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Propiedad</Label>
                            <Select
                              value={field.state.value ? String(field.state.value) : ""}
                              onValueChange={(v) => {
                                const numValue = Number(v);
                                field.handleChange(numValue);
                                validateField("idPropiedad", numValue);
                              }}
                              disabled={loadingAvailableProperties}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={loadingAvailableProperties ? "Cargando..." : "Selecciona una propiedad"} />
                              </SelectTrigger>
                              <SelectContent>
                                {(availableProperties ?? []).length > 0 ? (
                                  (availableProperties ?? []).map((p: AvailableProperty) => (
                                    <SelectItem key={p.idPropiedad} value={String(p.idPropiedad)}>
                                      {p.idPropiedad} - {p.ubicacion}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="px-3 py-1 text-sm opacity-70">
                                    {loadingAvailableProperties ? "Cargando propiedades..." : "No hay propiedades disponibles."}
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            {zodErrors.idPropiedad && <p className="text-red-700 text-sm">{zodErrors.idPropiedad}</p>}
                            {formErrors.idPropiedad && <p className="text-red-700 text-sm">{formErrors.idPropiedad}</p>}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <div className="space-y-2 rounded-md border p-3">
                      <Label className="font-semibold">Asignar agente</Label>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Label htmlFor="buscarAgente2" className="text-sm">Buscar por cédula (mín. 3 dígitos)</Label>
                          <Input
                            id="buscarAgente2"
                            placeholder="Ej. 1 2345 6789"
                            value={cedulaAgente}
                            onChange={(e) => setCedulaAgente(e.target.value)}
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={() => setCedulaAgente("")}>
                          Limpiar
                        </Button>
                      </div>

                      <form.Field name="idAgente">
                        {(field) => {
                          const selectedId = field.state.value ? Number(field.state.value) : undefined;
                          const selectedExists = selectedId
                            ? agentes.some((a) => a.identificacion === selectedId)
                            : false;
                          const fallbackLabel = selectedId ? String(selectedId) : "";

                          return (
                            <div>
                              <Label className="text-sm mb-1">Seleccionar agente</Label>
                              <Select
                                value={selectedId ? String(selectedId) : ""}
                                onValueChange={(v) => {
                                  const numValue = Number(v);
                                  field.handleChange(numValue);
                                  validateField("idAgente", numValue);
                                }}
                                disabled={cargandoAgentesUI}
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
                                  {!selectedExists && selectedId && (
                                    <SelectItem value={String(selectedId)}>{fallbackLabel}</SelectItem>
                                  )}
                                  {agentes.length > 0 ? (
                                    agentes.map((a: AgentPreview) => (
                                      <SelectItem key={a.identificacion} value={String(a.identificacion)}>
                                        {a.nombreCompleto ?? String(a.identificacion)}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="px-3 py-1 text-sm opacity-70">
                                      {errorAgents ? "Error cargando agentes." : "Sin agentes para mostrar."}
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                              {formErrors.idAgente && <p className="text-red-700 text-sm mt-1">{formErrors.idAgente}</p>}
                            </div>
                          );
                        }}
                      </form.Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <form.Field name="montoTotal">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Monto total</Label>
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              max={MAX_MONEY}
                              value={String(field.state.value ?? "")}
                              onChange={(e) => field.handleChange(clampMoney(e.currentTarget.valueAsNumber))}
                              placeholder="Ej. 250000.00"
                            />
                            {zodErrors.montoTotal && <p className="text-red-700 text-sm">{zodErrors.montoTotal}</p>}
                            {formErrors.montoTotal && <p className="text-red-700 text-sm">{formErrors.montoTotal}</p>}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="deposito">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">Depósito</Label>
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              placeholder="Ej. 50000.00"
                              max={MAX_MONEY}
                              value={String(field.state.value ?? "")}
                              onChange={(e) => field.handleChange(clampMoney(e.currentTarget.valueAsNumber))}
                            />
                            {zodErrors.deposito && <p className="text-red-700 text-sm">{zodErrors.deposito}</p>}
                            {formErrors.deposito && <p className="text-red-700 text-sm">{formErrors.deposito}</p>}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="porcentajeComision">
                        {(field) => (
                          <div>
                            <Label className="font-semibold">% Comisión al agente</Label>
                            <Input
                              type="number"
                              min={0}
                              max={MAX_PERCENT}
                              step="0.01"
                              value={String(field.state.value ?? "")}
                              onChange={(e) => {
                                const raw = e.currentTarget.valueAsNumber;
                                const v = Number.isNaN(raw) ? 0 : clamp(raw, 0, MAX_PERCENT);
                                field.handleChange(v);
                              }}
                              onBlur={() => validateField("porcentajeComision", field.state.value)}
                              placeholder="Ej. 3.5"
                            />
                            {zodErrors.porcentajeComision && <p className="text-red-700 text-sm">{zodErrors.porcentajeComision}</p>}
                            {formErrors.porcentajeComision && <p className="text-red-700 text-sm">{formErrors.porcentajeComision}</p>}
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </>
                )}

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep("tipo")}>Atrás</Button>
                  <Button type="submit" disabled={!canContinueDatos}>Continuar</Button>
                </DialogFooter>
              </form>
            )}

            {step === "condiciones" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (tipoSeleccionado === "alquiler") {
                    form.setFieldValue("fechaFin", fechaFinCalculada);
                  }
                  form.handleSubmit();
                }}
                className="space-y-4 py-2"
              >
                <form.Field name="condicionesTexto">
                  {(field) => (
                    <div>
                      <Label className="font-semibold">Condiciones (una por línea)</Label>
                      <Textarea
                        rows={6}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={`Ej.: Pago inicial a 7 días
Entregar llaves al firmar`}
                      />
                    </div>
                  )}
                </form.Field>

                {formError && <p className="text-red-700 text-sm text-center">{formError}</p>}

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep("datos")}>
                    Atrás
                  </Button>
                  <Button type="submit" disabled={create.isPending}>
                    {create.isPending ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creando…</>) : "Continuar"}
                  </Button>
                </DialogFooter>
              </form>
            )}

            {step === "assign" && createdContractId && (
              <FormAsignarParticipantes
                idContrato={createdContractId}
                onSuccess={() => {
                  setOpen(false);
                  resetAll();
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}