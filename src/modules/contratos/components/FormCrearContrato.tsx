import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { extractServerErrors } from "@/utils/serverExtract";
import { useDebounced } from "@/utils/debounce";
import { useCreateContract, useGetAgentPreview, useGetAvailableProperties, useGetContractType } from "../hooks/contractHooks";
import FormAsignarParticipantes from "./FormAsignarParticipantes";
import { AgentPreview, AvailableProperty, ContractType, CreateContract } from "../models/contract";
import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/animate-ui/components/headless/dialog";
import { createContractSchema } from "../schema/contractValidators";

type Step = "create" | "assign";
const hoyISO = () => new Date().toISOString().slice(0, 10);

export default function FormCrearContrato() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("create");
  const [createdContractId, setCreatedContractId] = useState<number | null>(null);
  
  const { availableProperties, loadingAvailableProperties } = useGetAvailableProperties();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

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
  const opcionesAgentes = agentes;

  const create = useCreateContract();

  const form = useForm({
    defaultValues: {
      fechaInicio: hoyISO(),
      fechaFin: hoyISO(),
      fechaFirma: hoyISO(),
      fechaPago: hoyISO(),
      idTipoContrato: undefined as number | undefined,
      idPropiedad: undefined as number | undefined,
      idAgente: undefined as number | undefined,
      montoTotal: 0 as number,
      deposito: 0 as number,
      porcentajeComision: 0 as number,
      condicionesTexto: "" as string,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({});
      setFormError(null);

      const result = createContractSchema.safeParse(value);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const i of result.error.issues) {
          const k = i.path.join(".");
          if (!fieldErrors[k]) fieldErrors[k] = i.message;
        }
        setFormErrors(fieldErrors);
        return;
      }

      try {
        const payload: CreateContract = {
          fechaInicio: value.fechaInicio,
          fechaFin: value.fechaFin,
          fechaFirma: value.fechaFirma,
          fechaPago: value.fechaPago,
          idTipoContrato: Number(value.idTipoContrato),
          idPropiedad: Number(value.idPropiedad),
          idAgente: Number(value.idAgente),
          montoTotal: Number(value.montoTotal),
          deposito: Number(value.deposito),
          porcentajeComision: Number(value.porcentajeComision),
          estado: null,
          condiciones: value.condicionesTexto
            ? value.condicionesTexto.split("\n").map((t) => t.trim()).filter(Boolean)
            : [],
        };

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
    }
  });

  const resetAll = () => {
    setStep("create");
    setCreatedContractId(null);
    setFormErrors({});
    setFormError(null);
    setCedulaAgente("");
    form.reset();
  };

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
          className=" max-h-[95vh] rounded-2xl overflow-hidden p-4"
        >
          {step === "create" && (
            <>
              <div className="max-h-[85vh] overflow-y-auto pr-3 mt-4
                  scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700 scrollbar-track-gray-100">

              <DialogHeader
                className="sticky top-0 z-20 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur
             border-b py-2 px-4"
              >
                <DialogTitle>Crear contrato</DialogTitle> 
                <DialogDescription>
                  Completa los datos y continúa para asignar participantes.
                </DialogDescription> 
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-4 py-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["fechaInicio", "fechaFin", "fechaFirma", "fechaPago"] as const).map((name) => (
                    <form.Field key={name} name={name}>
                      {(field) => (
                        <div>
                          <Label className="font-semibold">{name.replace("fecha", "Fecha ")}</Label>
                          <Input
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          {formErrors[name] && <p className="text-red-700 text-sm">{formErrors[name]}</p>}
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
                        {formErrors.idTipoContrato && <p className="text-red-700 text-sm">{formErrors.idTipoContrato}</p>}
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
                        {formErrors.idPropiedad && <p className="text-red-700 text-sm">{formErrors.idPropiedad}</p>}
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="space-y-2 rounded-md border p-3">
                  <Label className="font-semibold">Asignar agente</Label>

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
                        ? opcionesAgentes.some((a) => a.identificacion === selectedId)
                        : false;

                      const fallbackLabel = selectedId ? String(selectedId) : "";

                      return (
                        <div>
                          <Label className="text-sm mb-1">Seleccionar agente</Label>
                          <Select
                            value={selectedId ? String(selectedId) : ""}
                            onValueChange={(v) => field.handleChange(Number(v))}
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

                              {opcionesAgentes.length > 0 ? (
                                opcionesAgentes.map((a: AgentPreview) => (
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

                          {fetchingAgents && <p className="text-xs opacity-60 mt-1">Actualizando lista…</p>}
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
                          value={String(field.state.value ?? "")}
                          onChange={(e) => {
                            const v = e.currentTarget.valueAsNumber;
                            field.handleChange(Number.isNaN(v) ? 0 : v);
                          }}
                          placeholder="Ej. 250000.00"
                        />
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
                          value={String(field.state.value ?? "")}
                          onChange={(e) => {
                            const v = e.currentTarget.valueAsNumber;
                            field.handleChange(Number.isNaN(v) ? 0 : v);
                          }}
                          placeholder="Ej. 50000.00"
                        />
                        {formErrors.deposito && <p className="text-red-700 text-sm">{formErrors.deposito}</p>}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="porcentajeComision">
                    {(field) => (
                      <div>
                        <Label className="font-semibold">% Comisión</Label>
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
                        />
                        {formErrors.porcentajeComision && (
                          <p className="text-red-700 text-sm">{formErrors.porcentajeComision}</p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="condicionesTexto">
                  {(field) => (
                    <div>
                      <Label className="font-semibold">Condiciones (una por línea)</Label>
                      <Textarea
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={`Ej.: Pago inicial a 7 días
Entregar llaves al firmar`}
                      />
                    </div>
                  )}
                </form.Field>

                {formError && <p className="text-red-700 text-sm text-center">{formError}</p>}

                <DialogFooter>
                  <Button type="submit" disabled={create.isPending}>
                    {create.isPending ? "Creando..." : "Crear"}
                  </Button>

                  {/* Botón cierra con animación */}
                  <DialogClose>
                    <Button type="button" variant="outline" disabled={create.isPending}>
                      Cancelar
                    </Button>
                  </DialogClose>
                </DialogFooter>
                </form>
              </div>
            </>
          )}

          {step === "assign" && createdContractId && (
            <FormAsignarParticipantes
              idContrato={createdContractId}
              onSuccess={() => {
                setOpen(false);
                resetAll();
              }}
              onCancel={() => {
                setStep("create");
                setCreatedContractId(null);
              }}
            />
          )}
        </DialogPanel>
      </Dialog>
    </>
  );
}
