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
import { createClienteSchema } from "../schemas/clientSchemas";
import { initialValuesClient } from "../types/clientTypes";
import { Label } from "@radix-ui/react-label";

const FormAgregarCliente = () => {
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const crear = useCreateCliente();

  const form = useForm({
    defaultValues: initialValuesClient,
    onSubmit: async ({ value, formApi }) => {
      setFormErrors({});
      const result = createClienteSchema.safeParse(value);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const field = String(err.path[0] ?? "server");
          fieldErrors[field] = err.message;
        });
        setFormErrors(fieldErrors);
        return;
      }

      try {
        await crear.mutateAsync({ cliente: result.data });
        formApi.reset();
        setOpen(false);
        toast.success("Cliente creado correctamente");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setFormErrors({ credentials: "Credenciales incorrectas" });
        } else if (err?.response?.data?.message) {
          setFormErrors({ server: err.response.data.message });
        } else {
          setFormErrors({
            server: "Error en el servidor, por favor intenta más tarde",
          });
        }
      }
    },
  });

  return (
    <>
      {/* Botón trigger (no existe DialogTrigger en tu wrapper) */}
      <Button
        className="hover:cursor-pointer"
        variant="default"
        onClick={() => setOpen(true)}
      >
        <Plus /> Agregar cliente
      </Button>

      {/* Dialog controlado por estado */}
      <Dialog open={open} onClose={setOpen}>
        {/* DialogPanel ya incluye overlay + panel centrado */}
        <DialogPanel className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar cliente</DialogTitle>
            <DialogDescription>
              Registra un nuevo cliente en el sistema.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="mt-2"
          >
            {/* Identificación */}
            <div className="mb-4">
              <form.Field
                name="identificacion"
                validators={{ onChangeAsyncDebounceMs: 300 }}
              >
                {(field) => (
                  <div className="mb-4">
                    <Label className="font-semibold mb-2" htmlFor="identificacion">
                      Cédula
                    </Label>
                    <Input
                      id="identificacion"
                      type="text"
                      inputMode="numeric"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      placeholder="504440503"
                    />
                    {formErrors.identificacion && (
                      <p className="text-red-700 text-sm">{formErrors.identificacion}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Nombre */}
            <div className="mb-4">
              <form.Field
                name="nombre"
                validators={{ onChangeAsyncDebounceMs: 300 }}
                children={(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="nombre">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {formErrors.nombre && (
                      <p className="text-red-700 text-sm">{formErrors.nombre}</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Apellido 1 */}
            <div className="mb-4">
              <form.Field
                name="apellido1"
                validators={{ onChangeAsyncDebounceMs: 300 }}
                children={(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="apellido1">
                      Primer apellido
                    </Label>
                    <Input
                      id="apellido1"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {formErrors.apellido1 && (
                      <p className="text-red-700 text-sm">{formErrors.apellido1}</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Apellido 2 (opcional) */}
            <div className="mb-4">
              <form.Field
                name="apellido2"
                validators={{ onChangeAsyncDebounceMs: 300 }}
                children={(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="apellido2">
                      Segundo apellido (opcional)
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
              />
            </div>

            {/* Teléfono */}
            <div className="mb-6">
              <form.Field
                name="telefono"
                validators={{ onChangeAsyncDebounceMs: 300 }}
                children={(field) => (
                  <div>
                    <Label className="font-semibold mb-2" htmlFor="telefono">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+506 8888 8888"
                    />
                    {formErrors.telefono && (
                      <p className="text-red-700 text-sm">{formErrors.telefono}</p>
                    )}
                  </div>
                )}
              />
            </div>

            {(formErrors.server || formErrors.credentials) && (
              <p className="text-red-700 text-sm text-center mb-2">
                {formErrors.credentials ?? formErrors.server}
              </p>
            )}

            <DialogFooter className="flex gap-2">
              <Button type="submit" disabled={crear.isPending}>
                {crear.isPending ? "Guardando..." : "Guardar"}
              </Button>

              <DialogClose>
                <Button
                  type="button"
                  variant="outline"
                  disabled={crear.isPending}
                >
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
