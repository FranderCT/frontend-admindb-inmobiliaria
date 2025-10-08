import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/animate-ui/components/headless/dialog";
import { Plus } from "lucide-react";
import { useCreateCliente } from "../hooks/clientesHooks";
import { initialValuesClient } from "../types/clientTypes";
import { Label } from "@radix-ui/react-label";
import { extractServerErrors } from "@/utils/serverExtract";

const FormAgregarCliente = () => {
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const crear = useCreateCliente();

  const form = useForm({
    defaultValues: initialValuesClient,
    onSubmit: async ({ value, formApi }) => {
      setFormErrors({});
      setFormError(null);

      try {
        await crear.mutateAsync({ cliente: value });
        formApi.reset();
        setOpen(false);
        toast.success("Cliente creado correctamente");
      } catch (err) {
        const { fieldErrors, formError } = extractServerErrors(err);
        setFormErrors(fieldErrors);
        setFormError(formError ?? null);
      }
    },
  });


  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)}>
        <Plus /> Agregar cliente
      </Button>

      <Dialog open={open} onClose={setOpen}>
        <DialogPanel className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar cliente</DialogTitle>
            <DialogDescription>Registra un nuevo cliente en el sistema.</DialogDescription>
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
                  <div className="mb-4">
                    <Label className="font-semibold mb-2" htmlFor="identificacion">
                      Cédula
                    </Label>
                    <Input
                      id="identificacion"
                      type="number"
                      inputMode="numeric"
                      // evita NaN/0 al borrar
                      value={field.state.value ?? ""}
                      onChange={(e) => {
                        const v = e.currentTarget.valueAsNumber;
                        // si está vacío, valueAsNumber es NaN
                        if (Number.isNaN(v)) field.handleChange(undefined);
                        else field.handleChange(Math.trunc(v)); // nos aseguramos entero
                      }}
                      placeholder="504440503"
                      min={1}
                      step={1}
                    />
                    {formErrors.identificacion && (
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
                    {formErrors.nombre && (
                      <p className="text-red-700 text-sm">{formErrors.nombre}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="mb-4">
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
                    {formErrors.apellido1 && (
                      <p className="text-red-700 text-sm">{formErrors.apellido1}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="mb-4">
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
                    {formErrors.apellido2 && (
                      <p className="text-red-700 text-sm">{formErrors.apellido2}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="mb-6">
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
                    {formErrors.telefono && (
                      <p className="text-red-700 text-sm">{formErrors.telefono}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {(formError) && (
              <p className="text-red-700 text-sm text-center mb-2">{formError}</p>
            )}

            <DialogFooter className="flex gap-2">
              <Button type="submit" >
                {crear.isPending ? "Guardando..." : "Guardar"}
              </Button>

              <DialogClose>
                <Button type="button" variant="outline" disabled={crear.isPending}>
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default FormAgregarCliente;
