import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/animate-ui/components/headless/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useUpdateClient } from "../hooks/clientesHooks";
import { extractServerErrors } from "@/utils/serverExtract";
import { useEffect, useState } from "react";
import { EditClienteDialogProps } from "../types/clientTypes";
import { Switch, SwitchThumb } from "@/components/animate-ui/primitives/base/switch";
import { cn } from "@/lib/utils";

const FormEditCliente = ({
  open,
  onOpenChange,
  from = "bottom",
  showCloseButton = true,
  cliente,
}: EditClienteDialogProps) => {
  const updateCliente = useUpdateClient();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      identificacion: String(cliente.identificacion),
      nombre: cliente.nombre ?? "",
      apellido1: cliente.apellido1 ?? "",
      apellido2: cliente.apellido2 ?? "",
      telefono: cliente.telefono ?? "",
      estado: cliente.estado ? 1 : 0,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({});
      setFormError(null);

      try {
        await updateCliente.mutateAsync({
          client: {
            identificacion: Number(value.identificacion),
            nombre: value.nombre?.trim() ?? "",
            apellido1: value.apellido1?.trim() ?? "",
            apellido2: value.apellido2?.trim() ?? "",
            telefono: value.telefono?.trim() ?? "",
            estado: Boolean(value.estado),
          }
        });

        toast.success("Cliente actualizado correctamente");
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
      form.setFieldValue("identificacion", String(cliente.identificacion));
      form.setFieldValue("nombre", cliente.nombre ?? "");
      form.setFieldValue("apellido1", cliente.apellido1 ?? "");
      form.setFieldValue("apellido2", cliente.apellido2 ?? "");
      form.setFieldValue("telefono", cliente.telefono ?? "");
      form.setFieldValue("estado", cliente.estado ? 1 : 0);
      setFormErrors({});
      setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cliente]);

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogPanel from={from} showCloseButton={showCloseButton} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>Actualiza la información y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="mt-2"
        >
          <div className="mb-4">
            <form.Field name="identificacion">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="identificacion">
                    Identificación
                  </Label>
                  <Input
                    id="identificacion"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value.replace(/[^\d]/g, ""))}
                    disabled
                  />
                  {!!formErrors.identificacion && (
                    <p className="text-red-700 text-sm">{formErrors.identificacion}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="mb-4">
            <form.Field name="nombre">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="nombre">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {!!formErrors.nombre && <p className="text-red-700 text-sm">{formErrors.nombre}</p>}
                </div>
              )}
            </form.Field>
          </div>

          <div className="mb-4 grid md:grid-cols-2 gap-4">
            <form.Field name="apellido1">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="apellido1">
                    Primer apellido
                  </Label>
                  <Input
                    id="apellido1"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {!!formErrors.apellido1 && <p className="text-red-700 text-sm">{formErrors.apellido1}</p>}
                </div>
              )}
            </form.Field>

            <form.Field name="apellido2">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="apellido2">
                    Segundo apellido
                  </Label>
                  <Input
                    id="apellido2"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {!!formErrors.apellido2 && <p className="text-red-700 text-sm">{formErrors.apellido2}</p>}
                </div>
              )}
            </form.Field>
          </div>

          <div className="mb-4">
            <form.Field name="telefono">
              {(field) => (
                <div>
                  <Label className="font-semibold mb-2" htmlFor="telefono">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="8888 8888"
                  />
                  {!!formErrors.telefono && <p className="text-red-700 text-sm">{formErrors.telefono}</p>}
                </div>
              )}
            </form.Field>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Estado</span>

            <form.Field name="estado">
              {(field) => {
                const isChecked = field.state.value === 1;

                return (
                  <Switch
                    checked={isChecked}
                    onCheckedChange={(v) => field.handleChange(v ? 1 : 0)} 
                    className={cn(
                      'relative flex p-0.5 h-6 w-10 items-center justify-start rounded-full border transition-colors',
                      'data-[checked]:bg-primary data-[checked]:justify-end',
                    )}
                  >
                    <SwitchThumb
                      className="rounded-full bg-accent h-full aspect-square"
                      pressedAnimation={{ width: 22 }}
                    />
                  </Switch>
                );
              }}
            </form.Field>
          </div>

          {!!formError && <p className="text-red-700 text-sm text-center mb-2">{formError}</p>}

          <DialogFooter className="flex gap-2 mt-4">
            <Button type="submit" disabled={updateCliente.isPending}>
              {updateCliente.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>

            <DialogClose>
              <Button type="button" variant="outline" disabled={updateCliente.isPending}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogPanel>
    </Dialog>
  );
}
export default FormEditCliente;