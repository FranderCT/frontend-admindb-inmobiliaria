import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { extractServerErrors } from "@/utils/serverExtract";
import { useDebounced } from "@/utils/debounce";
import { useCreateContract, useGetAgentPreview, useGetContractType } from "../hooks/contractHooks";
import FormAsignarParticipantes from "./FormAsignarParticipantes";
import { AgentPreview, ContractType, CreateContract } from "../models/contract";
import { useState } from "react";

type Step = "create" | "assign";

const hoyISO = () => new Date().toISOString().slice(0, 10);

export default function FormCrearContrato() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("create");
  const [createdContractId, setCreatedContractId] = useState<number | null>(null);

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
      condicionesTexto: "" as string,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({});
      setFormError(null);
      try {
        const payload: CreateContract = {
          fechaInicio: value.fechaInicio,
          fechaFin: value.fechaFin,
          fechaFirma: value.fechaFirma,
          fechaPago: value.fechaPago,
          idTipoContrato: Number(value.idTipoContrato),
          idPropiedad: Number(value.idPropiedad),
          idAgente: Number(value.idAgente),
          condiciones: value.condicionesTexto
            ? value.condicionesTexto
              .split("\n")
              .map((t) => t.trim())
              .filter(Boolean)
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
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setStep("create");
          setCreatedContractId(null);
          setFormErrors({});
          setFormError(null);
          setCedulaAgente("");
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus /> Crear contrato
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        {step === "create" && (
          <>
            <DialogHeader>
              <DialogTitle>Crear contrato</DialogTitle>
              <DialogDescription>Completa los datos y continúa para asignar participantes.</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Fechas */}
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

              {/* Tipo contrato / Propiedad */}
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
                      <Label className="font-semibold">ID Propiedad</Label>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={field.state.value ?? ""}
                        onChange={(e) => {
                          const v = e.currentTarget.valueAsNumber;
                          field.handleChange(Number.isNaN(v) ? undefined : Math.trunc(v));
                        }}
                        placeholder="Ej. 3"
                      />
                      {formErrors.idPropiedad && <p className="text-red-700 text-sm">{formErrors.idPropiedad}</p>}
                    </div>
                  )}
                </form.Field>
              </div>

                <Label className="font-semibold">Asignar agente</Label>

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
                      ? opcionesAgentes.some(a => a.identificacion === selectedId)
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

                        {fetchingAgents && (
                          <p className="text-xs opacity-60 mt-1">Actualizando lista…</p>
                        )}
                        {formErrors.idAgente && (
                          <p className="text-red-700 text-sm mt-1">{formErrors.idAgente}</p>
                        )}
                      </div>
                    );
                  }}
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
                      placeholder="Ej.: Pago inicial a 7 días&#10;Entregar llaves al firmar"
                    />
                  </div>
                )}
              </form.Field>

              {formError && <p className="text-red-700 text-sm text-center">{formError}</p>}

              <DialogFooter>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? "Creando..." : "Crear"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "assign" && createdContractId && (
          <FormAsignarParticipantes
            idContrato={createdContractId}
            onSuccess={() => {
              setOpen(false);
              setStep("create");
              setCreatedContractId(null);
              setCedulaAgente("");
              form.reset();
            }}
            onCancel={() => {
              setStep("create");
              setCreatedContractId(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

