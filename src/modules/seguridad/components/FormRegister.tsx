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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { extractServerErrors } from "@/utils/serverExtract";
import { useCreateUser, useGetRoles } from "../hooks/usuariosHooks";
import { registerUserSchema } from "../schema/userSchema";
import { initialValuesRegister } from "../types/userTypes";

const FormRegister = () => {
    const [open, setOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);
    const create = useCreateUser();
    const { roles } = useGetRoles();

    const form = useForm({
        defaultValues: initialValuesRegister,
        onSubmit: async ({ value, formApi }) => {
            setFormErrors({});
            setFormError(null);
            const result = registerUserSchema.safeParse(value);
            if (!result.success) {
                const errs: Record<string, string> = {};
                for (const i of result.error.issues) {
                    const k = i.path.join(".");
                    if (!errs[k]) errs[k] = i.message;
                }
                setFormErrors(errs);
                return;
            }

            try {
                await create.mutateAsync({ user: value });
                formApi.reset();
                setOpen(false);
                toast.success("Usuario creado correctamente");
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
                <Plus /> Registrar usuario
            </Button>

            <Dialog open={open} onClose={setOpen}>
                <DialogPanel className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Registrar usuario</DialogTitle>
                        <DialogDescription>Registra un nuevo usuario en el sistema.</DialogDescription>
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
                        <div className="mb-4">
                            <form.Field name="apellido1">
                                {(field) => (
                                    <div>
                                        <Label className="font-semibold mb-2" htmlFor="apellido1">
                                            Primer Apellido
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
                                            Segundo Apellido
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
                        <div className="mb-4">
                            <form.Field name="email">
                                {(field) => (
                                    <div>
                                        <Label className="font-semibold mb-2" htmlFor="email">
                                            Correo electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            value={field.state.value ?? ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {formErrors.email && (
                                            <p className="text-red-700 text-sm">{formErrors.email}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>
                        <div className="mb-4">
                            <form.Field name="password">
                                {(field) => (
                                    <div>
                                        <Label className="font-semibold mb-2" htmlFor="password">
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="password"
                                            value={field.state.value ?? ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        {formErrors.password && (
                                            <p className="text-red-700 text-sm">{formErrors.password}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <form.Field
                            name="idRolUsuario"
                            children={(field) => (
                                <div>
                                    <Label className="font-semibold mb-2" htmlFor="idRolUsuario">
                                        Rol
                                    </Label>
                                    <Select
                                        value={field.state.value ? field.state.value.toString() : ""}
                                        onValueChange={(value) => field.handleChange(Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol para el usuario" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((rol) => (
                                                <SelectItem
                                                    key={rol.idRolUsuario}
                                                    value={rol.idRolUsuario.toString()}
                                                >
                                                    {rol.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors.idRolUsuario && (
                                        <p className="text-red-700 text-sm">{formErrors.idRolUsuario}</p>
                                    )}
                                </div>
                            )}
                        />

                        {Object.keys(formErrors).length === 0 && formError && (
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

export default FormRegister;