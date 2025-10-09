import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogPanel, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose,
} from "@/components/animate-ui/components/headless/dialog";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import type { EditPropiedadDialogProps } from "../types/propiedadTypes";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel,
} from "@/components/ui/select";
import { extractServerErrors } from "@/utils/serverExtract";
import { useGetPropertyStatuses, useGetPropertyTypes, useUpdateProperty } from "../hooks/propiedadesHook";

const FormEditPropiedad = ({
  open, onOpenChange, from = "bottom", showCloseButton = true, property,
}: EditPropiedadDialogProps) => {
  const updateProp = useUpdateProperty();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
      const { propertyTypes } = useGetPropertyTypes();
      const { propertyStatuses } = useGetPropertyStatuses();

  const form = useForm({
    defaultValues: {
      idPropiedad: property.idPropiedad,
      ubicacion: property.ubicacion ?? "",
      precio: property.precio ?? 0,
      estadoPropiedadId: property.estadoPropiedad?.idEstadoPropiedad,
      tipoInmuebleId: property.tipoInmueble?.idTipoInmueble,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({}); setFormError(null);
      try {
        await updateProp.mutateAsync({
          prop: {
            idPropiedad: value.idPropiedad,
            ubicacion: (value.ubicacion ?? "").trim(),
            precio: Number(value.precio) || 0,
            idEstado: Number(value.estadoPropiedadId),
            idTipoInmueble: Number(value.tipoInmuebleId),
          },
        });
        onOpenChange(false);
      } catch (err) {
        const { fieldErrors, formError } = extractServerErrors(err);
        setFormErrors(fieldErrors); setFormError(formError ?? null);
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
                  type="number"
                  inputMode="numeric"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="₡1 400 000"
                  min={1}
                  step={1}
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
                  value={field.state.value ? String(field.state.value) : "all"}
                  onValueChange={(v) => field.handleChange(v === "all" ? undefined : Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Estados</SelectLabel>
                      <SelectItem value="all">Todos</SelectItem>
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
                  value={field.state.value ? String(field.state.value) : "all"}
                  onValueChange={(v) => field.handleChange(v === "all" ? undefined : Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipos</SelectLabel>
                      <SelectItem value="all">Todos</SelectItem>
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
            <Button type="submit" disabled={updateProp.isPending}>
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
