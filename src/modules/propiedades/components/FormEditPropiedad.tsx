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

const FormEditPropiedad = ({
  open, onOpenChange, from = "bottom", showCloseButton = true, property, disabled = false,
}: EditPropiedadDialogProps) => {
  const updateProp = useUpdateProperty();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const { propertyTypes } = useGetPropertyTypes();
  const { propertyStatuses } = useGetPropertyStatuses();;

  const initialRef = useRef({
    ubicacion: property.ubicacion ?? "",
    precio: Number(property.precio ?? 0),
    estadoPropiedadId: property.estadoPropiedad?.idEstadoPropiedad,
    tipoInmuebleId: property.tipoInmueble?.idTipoInmueble,
  });

  useEffect(() => {
    if (open) {
      initialRef.current = {
        ubicacion: property.ubicacion ?? "",
        precio: Number(property.precio ?? 0),
        estadoPropiedadId: property.estadoPropiedad?.idEstadoPropiedad,
        tipoInmuebleId: property.tipoInmueble?.idTipoInmueble,
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
    },
    onSubmit: async ({ value }) => {
      // normalizar (trim/number)
      const current = {
        ubicacion: (value.ubicacion ?? "").trim(),
        precio: Number(value.precio ?? 0),
        estadoPropiedadId: value.estadoPropiedadId,
        tipoInmuebleId: value.tipoInmuebleId,
      };
      const initial = initialRef.current;

      // construir diff (sólo keys cambiadas)
      const changes: Record<string, any> = {};
      if (current.ubicacion !== initial.ubicacion) changes.ubicacion = current.ubicacion;
      if (current.precio !== initial.precio) changes.precio = current.precio;
      if (current.estadoPropiedadId !== initial.estadoPropiedadId)
        changes.idEstado = Number(current.estadoPropiedadId);
      if (current.tipoInmuebleId !== initial.tipoInmuebleId)
        changes.idTipoInmueble = Number(current.tipoInmuebleId);

      // si no cambió nada, sólo cierra
      if (Object.keys(changes).length === 0) {
        onOpenChange(false);
        return;
      }

      try {
        await updateProp.mutateAsync({
          prop: { idPropiedad: value.idPropiedad, ...changes },
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
      form.setFieldValue("precio", property.precio ?? 0);
      form.setFieldValue("estadoPropiedadId", property.estadoPropiedad?.idEstadoPropiedad);
      form.setFieldValue("tipoInmuebleId", property.tipoInmueble?.idTipoInmueble);
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
          className="mt-2 space-y-4"
        >
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
                  disabled={disabled} />
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
                  type="number"
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
                  min={1}
                  step={1}
                  disabled={disabled} />
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
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
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
                {!!formErrors.estadoPropiedadId && (
                  <p className="text-red-700 text-sm">{formErrors.estadoPropiedadId}</p>
                )}
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
                  disabled={disabled}>
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
                {!!formErrors.tipoInmuebleId && (
                  <p className="text-red-700 text-sm">{formErrors.tipoInmuebleId}</p>
                )}
              </div>
            )}
          </form.Field>

          {!!formError && <p className="text-red-700 text-sm text-center">{formError}</p>}

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
