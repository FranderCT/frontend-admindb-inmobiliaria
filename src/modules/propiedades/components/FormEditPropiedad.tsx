/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogPanel, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose,
} from "@/components/animate-ui/components/headless/dialog";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef, useState } from "react";
import type { EditPropiedadDialogProps } from "../types/propiedadTypes";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel,
} from "@/components/ui/select";
import { extractServerErrors } from "@/utils/serverExtract";
import { useGetPropertyStatuses, useGetPropertyTypes, useUpdateProperty } from "../hooks/propiedadesHook";
import { MAX_DIGITS, MAX_PRICE } from "../schema/propertyValidators";
import { Switch, SwitchThumb } from "@/components/animate-ui/primitives/base/switch";
import { cn } from "@/lib/utils";
import { FilePlus } from "lucide-react";

const FormEditPropiedad = ({
  open, onOpenChange, from = "bottom", showCloseButton = true, property, disabled = false,
}: EditPropiedadDialogProps) => {
  const updateProp = useUpdateProperty();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const { propertyTypes } = useGetPropertyTypes();
  const { propertyStatuses } = useGetPropertyStatuses();

  const initialRef = useRef({
    ubicacion: property.ubicacion ?? "",
    precio: Number(property.precio ?? 0),
    estadoPropiedadId: property.estadoPropiedad?.idEstadoPropiedad,
    tipoInmuebleId: property.tipoInmueble?.idTipoInmueble,
    identificacion: property.propietario?.identificacion ?? undefined,
    amueblado: Boolean(property.amueblado),
    cantHabitaciones: Number(property.cantHabitaciones ?? 0),
    cantBannios: Number(property.cantBannios ?? 0),
    areaM2: Number(property.areaM2 ?? 0),
  });

  useEffect(() => {
    if (open) {
      initialRef.current = {
        ubicacion: property.ubicacion ?? "",
        precio: Number(property.precio ?? 0),
        estadoPropiedadId: property.estadoPropiedad?.idEstadoPropiedad,
        tipoInmuebleId: property.tipoInmueble?.idTipoInmueble,
        identificacion: property.propietario?.identificacion ?? undefined,
        amueblado: Boolean(property.amueblado),
        cantHabitaciones: Number(property.cantHabitaciones ?? 0),
        cantBannios: Number(property.cantBannios ?? 0),
        areaM2: Number(property.areaM2 ?? 0),
      };
    }
  }, [open, property]);

  const form = useForm({
    defaultValues: {
      idPropiedad: property.idPropiedad,
      ubicacion: property.ubicacion ?? "",
      precio: Number(property.precio ?? 0),
      estadoPropiedadId: property.estadoPropiedad?.idEstadoPropiedad,
      tipoInmuebleId: property.tipoInmueble?.idTipoInmueble,
      identificacion: property.propietario?.identificacion ?? undefined,
      amueblado: Boolean(property.amueblado),
      cantHabitaciones: Number(property.cantHabitaciones ?? 0),
      cantBannios: Number(property.cantBannios ?? 0),
      areaM2: Number(property.areaM2 ?? 0),
      file: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const current = {
        ubicacion: (value.ubicacion ?? "").trim(),
        precio: Number(value.precio ?? 0),
        estadoPropiedadId: value.estadoPropiedadId,
        tipoInmuebleId: value.tipoInmuebleId,
        identificacion: value.identificacion ? Number(value.identificacion) : undefined,
        amueblado: Boolean(value.amueblado),
        cantHabitaciones: Number(value.cantHabitaciones ?? 0),
        cantBannios: Number(value.cantBannios ?? 0),
        areaM2: Number(value.areaM2 ?? 0),
        file: value.file,
      };
      const initial = initialRef.current;

      const changes: Record<string, any> = {};
      if (current.ubicacion !== initial.ubicacion) changes.ubicacion = current.ubicacion;
      if (current.precio !== initial.precio) changes.precio = current.precio;
      if (current.estadoPropiedadId !== initial.estadoPropiedadId)
        changes.idEstado = Number(current.estadoPropiedadId);
      if (current.tipoInmuebleId !== initial.tipoInmuebleId)
        changes.idTipoInmueble = Number(current.tipoInmuebleId);
      if (current.identificacion !== initial.identificacion)
        changes.identificacion = current.identificacion;
      if (current.amueblado !== initial.amueblado)
        changes.amueblado = current.amueblado;
      if (current.cantHabitaciones !== initial.cantHabitaciones)
        changes.cantHabitaciones = current.cantHabitaciones;
      if (current.cantBannios !== initial.cantBannios)
        changes.cantBannios = current.cantBannios;
      if (current.areaM2 !== initial.areaM2)
        changes.areaM2 = current.areaM2;

      const hasFile = current.file instanceof File;

      if (Object.keys(changes).length === 0 && hasFile) {
        changes.amueblado = initial.amueblado; 
      }

      if (Object.keys(changes).length === 0 && !hasFile) {
        onOpenChange(false);
        return;
      }

      try {
        await updateProp.mutateAsync({
          prop: { idPropiedad: value.idPropiedad, ...changes },
          file: hasFile ? current.file : undefined,
        });
        onOpenChange(false);
      } catch (err) {
        const { fieldErrors, formError } = extractServerErrors(err);
        setFormErrors(fieldErrors);
        setFormError(formError ?? null);
      }
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldValue("idPropiedad", property.idPropiedad);
      form.setFieldValue("ubicacion", property.ubicacion ?? "");
      form.setFieldValue("precio", Number(property.precio ?? 0));
      form.setFieldValue("estadoPropiedadId", property.estadoPropiedad?.idEstadoPropiedad);
      form.setFieldValue("tipoInmuebleId", property.tipoInmueble?.idTipoInmueble);
      form.setFieldValue("identificacion", property.propietario?.identificacion ?? undefined);
      form.setFieldValue("amueblado", Boolean(property.amueblado));
      form.setFieldValue("cantHabitaciones", Number(property.cantHabitaciones ?? 0));
      form.setFieldValue("cantBannios", Number(property.cantBannios ?? 0));
      form.setFieldValue("areaM2", Number(property.areaM2 ?? 0));
      form.setFieldValue("file", undefined);
      setFormErrors({}); setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, property]);

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogPanel from={from} showCloseButton={showCloseButton} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar propiedad</DialogTitle>
          <DialogDescription>Actualiza la información y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
          className="mt-2"
        >
          <div className=" max-h-[75vh] overflow-y-auto px-1 pb-3 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700/70 dark:scrollbar-thumb-gray-500/60 scrollbar-track-transparent space-y-4">
            <form.Field name="idPropiedad">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="idPropiedad">ID</Label>
                  <Input id="idPropiedad" value={String(field.state.value)} disabled />
                </div>
              )}
            </form.Field>

            <form.Field name="ubicacion">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={disabled}
                  />
                  {!!formErrors.ubicacion && <p className="text-red-700 text-sm">{formErrors.ubicacion}</p>}
                </div>
              )}
            </form.Field>

            <form.Field name="precio">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="text"
                    inputMode="numeric"
                    value={field.state.value ?? ""}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                      let raw = e.target.value.replace(/\D+/g, "");
                      if (raw.length > MAX_DIGITS) raw = raw.slice(0, MAX_DIGITS);
                      if (raw.length > 1) raw = raw.replace(/^0+/, "") || "0";
                      if (raw) {
                        const n = Number(raw);
                        if (n > MAX_PRICE) raw = String(MAX_PRICE);
                      }
                      field.handleChange(Number(raw));
                    }}
                    placeholder="₡1 400 000"
                    disabled={disabled}
                    className={formErrors.precio ? "border-red-600" : ""}
                  />
                  {!!formErrors.precio && <p className="text-red-700 text-sm">{formErrors.precio}</p>}
                </div>
              )}
            </form.Field>

            <form.Field name="estadoPropiedadId">
              {(field) => (
                <div>
                  <Label className="text-sm font-medium">Estado de propiedad</Label>
                  <Select
                    value={field.state.value !== undefined ? String(field.state.value) : undefined}
                    onValueChange={(v) => field.handleChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Estados</SelectLabel>
                        {propertyStatuses.map((opt) => (
                          <SelectItem key={opt.idEstadoPropiedad} value={String(opt.idEstadoPropiedad)}>
                            {opt.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {!!formErrors.estadoPropiedadId && <p className="text-red-700 text-sm">{formErrors.estadoPropiedadId}</p>}
                </div>
              )}
            </form.Field>

            <form.Field name="tipoInmuebleId">
              {(field) => (
                <div>
                  <Label className="text-sm font-medium">Tipo de inmueble</Label>
                  <Select
                    value={field.state.value !== undefined ? String(field.state.value) : undefined}
                    onValueChange={(v) => field.handleChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipos</SelectLabel>
                        {propertyTypes.map((opt) => (
                          <SelectItem key={opt.idTipoInmueble} value={String(opt.idTipoInmueble)}>
                            {opt.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {!!formErrors.tipoInmuebleId && <p className="text-red-700 text-sm">{formErrors.tipoInmuebleId}</p>}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col justify-end">
                <Label className="font-semibold mb-2">Amueblado</Label>
                <form.Field name="amueblado">
                  {(field) => {
                    const isChecked = Boolean(field.state.value);
                    return (
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(v) => field.handleChange(!!v)}
                        className={cn(
                          "relative flex p-0.5 h-6 w-10 items-center justify-start rounded-full border transition-colors",
                          "data-[checked]:bg-primary data-[checked]:justify-end"
                        )}
                        disabled={disabled}
                      >
                        <SwitchThumb className="rounded-full bg-accent h-full aspect-square" />
                      </Switch>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="areaM2">
                {(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="areaM2">Área (m²)</Label>
                    <Input
                      id="areaM2"
                      type="text"
                      inputMode="numeric"
                      value={field.state.value ?? ""}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D+/g, "");
                        if (raw.length > MAX_DIGITS) raw = raw.slice(0, MAX_DIGITS);
                        if (raw.length > 1) raw = raw.replace(/^0+/, "") || "0";
                        if (raw) {
                          const n = Number(raw);
                          if (n > MAX_PRICE) raw = String(MAX_PRICE);
                        }
                        field.handleChange(Number(raw));
                      }}
                      placeholder="80"
                      aria-invalid={!!formErrors.areaM2}
                      className={formErrors.areaM2 ? "border-red-600" : ""}
                      disabled={disabled}
                    />
                    {formErrors.areaM2 && <p className="text-red-700 text-sm">{formErrors.areaM2}</p>}
                  </div>
                )}
              </form.Field>

              <form.Field name="cantHabitaciones">
                {(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="cantHabitaciones">Habitaciones</Label>
                    <Input
                      id="cantHabitaciones"
                      type="text"
                      inputMode="numeric"
                      value={field.state.value ?? ""}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D+/g, "");
                        if (raw.length > MAX_DIGITS) raw = raw.slice(0, MAX_DIGITS);
                        if (raw.length > 1) raw = raw.replace(/^0+/, "") || "0";
                        if (raw) {
                          const n = Number(raw);
                          if (n > MAX_PRICE) raw = String(MAX_PRICE);
                        }
                        field.handleChange(Number(raw));
                      }}
                      placeholder="3"
                      aria-invalid={!!formErrors.cantHabitaciones}
                      className={formErrors.cantHabitaciones ? "border-red-600" : ""}
                      disabled={disabled}
                    />
                    {formErrors.cantHabitaciones && <p className="text-red-700 text-sm">{formErrors.cantHabitaciones}</p>}
                  </div>
                )}
              </form.Field>

              <form.Field name="cantBannios">
                {(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="cantBannios">Baños</Label>
                    <Input
                      id="cantBannios"
                      type="text"
                      inputMode="numeric"
                      value={field.state.value ?? ""}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D+/g, "");
                        if (raw.length > MAX_DIGITS) raw = raw.slice(0, MAX_DIGITS);
                        if (raw.length > 1) raw = raw.replace(/^0+/, "") || "0";
                        if (raw) {
                          const n = Number(raw);
                          if (n > MAX_PRICE) raw = String(MAX_PRICE);
                        }
                        field.handleChange(Number(raw));
                      }}
                      placeholder="2"
                      aria-invalid={!!formErrors.cantBannios}
                      className={formErrors.cantBannios ? "border-red-600" : ""}
                      disabled={disabled}
                    />
                    {formErrors.cantBannios && <p className="text-red-700 text-sm">{formErrors.cantBannios}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="file">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label>Imagen</Label>
                  <label className="cursor-pointer border rounded-lg px-3 py-2 bg-white hover:bg-gray-50">
                    <FilePlus className="inline-block mr-2 h-4 w-4" />
                    Seleccionar imagen
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        field.handleChange(f);
                      }}
                      disabled={disabled}
                    />
                  </label>
                  {field.state.value && field.state.value instanceof File && (
                    <span className="text-sm text-muted-foreground">{field.state.value.name}</span>
                  )}
                </div>
              )}
            </form.Field>

            {!!formError && <p className="text-red-700 text-sm text-center">{formError}</p>}
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="submit" disabled={updateProp.isPending || disabled}>
              {updateProp.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
            <DialogClose>
              <Button type="button" variant="outline" disabled={updateProp.isPending}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

export default FormEditPropiedad;
