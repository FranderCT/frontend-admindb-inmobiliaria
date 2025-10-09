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
import { Label } from "@radix-ui/react-label";
import { extractServerErrors } from "@/utils/serverExtract";
import { useCreatePropertyStatus } from "../hooks/propiedadesHook";
import { initialValuesPropertyStatus } from "../types/propiedadTypes";

const FormCrearEstadoPropiedad = () => {
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const create = useCreatePropertyStatus();

  const form = useForm({
    defaultValues: initialValuesPropertyStatus,
    onSubmit: async ({ value, formApi }) => {
      setFormErrors({});
      setFormError(null);

      try {
        await create.mutateAsync({ property: value });
        formApi.reset();
        setOpen(false);
        toast.success("Estado de propiedad creado correctamente");
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
        <Plus /> Agregar estado de propiedad
      </Button>

      <Dialog open={open} onClose={setOpen}>
        <DialogPanel className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar estado de propiedad</DialogTitle>
            <DialogDescription>Registra un nuevo estado de propiedad en el sistema.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="mt-2"
          >
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

            {(formError) && (
              <p className="text-red-700 text-sm text-center mb-2">{formError}</p>
            )}

            <DialogFooter className="flex gap-2">
              <Button type="submit" >
                {create.isPending ? "Guardando..." : "Guardar"}
              </Button>

              <DialogClose>
                <Button type="button" variant="outline" disabled={create.isPending}>
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

export default FormCrearEstadoPropiedad;