import { useState, useMemo, useEffect } from "react";
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
import {
    useCreateProperty,
    useGetPropertyStatuses,
    useGetPropertyTypes
} from "../hooks/propiedadesHook";
import { initialValuesProperty } from "../types/propiedadTypes";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ClientSearchPreview } from "@/modules/clientes/models/client";
import { useGetClient, useGetClients } from "@/modules/clientes/hooks/clientesHooks";

function useDebounced<T>(value: T, delay = 400) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

const FormCrearPropiedad = () => {
    const [open, setOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const create = useCreateProperty();
    const { propertyTypes } = useGetPropertyTypes();
    const { propertyStatuses } = useGetPropertyStatuses();
    const [cedulaQuery, setCedulaQuery] = useState<string>("");
    const debouncedCedula = useDebounced(cedulaQuery.trim(), 450);

    const enabledSearch = debouncedCedula.length >= 3;

    const {
        clientes: clientesListado = [],
        loadingClientes,
        fetchingClientes,
        errorClientes,
    } = useGetClients();

    const {
        cliente: clienteBuscado,
        loadingCliente,
        fetchingCliente,
        errorCliente,
    } = useGetClient(debouncedCedula, { enabled: enabledSearch });

    const usarBusqueda =
        enabledSearch &&
        !loadingCliente &&
        !fetchingCliente &&
        !errorCliente &&
        !!clienteBuscado;

    const opcionesClientes = useMemo(() => {
        if (usarBusqueda) {
            const arr = Array.isArray(clienteBuscado) ? clienteBuscado : [clienteBuscado];
            return arr.filter(Boolean);
        }
        return clientesListado;
    }, [usarBusqueda, clienteBuscado, clientesListado]);

    const cargandoClientes =
        loadingClientes || fetchingClientes || (enabledSearch && (loadingCliente || fetchingCliente));


    const form = useForm({
        defaultValues: initialValuesProperty,
        onSubmit: async ({ value, formApi }) => {
            setFormErrors({});
            setFormError(null);
            try {
                await create.mutateAsync({ property: value });
                formApi.reset();
                setCedulaQuery("");
                setOpen(false);
                toast.success("Propiedad creada correctamente");
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
                <Plus /> Agregar propiedad
            </Button>

            <Dialog open={open} onClose={setOpen}>
                <DialogPanel className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Agregar propiedad</DialogTitle>
                        <DialogDescription>
                            Registra una nueva propiedad en el sistema.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="mt-2 space-y-4"
                    >
                        <div>
                            <form.Field name="ubicacion">
                                {(field) => (
                                    <div>
                                        <Label className="font-semibold mb-2" htmlFor="ubicacion">
                                            Ubicación
                                        </Label>
                                        <Input
                                            id="ubicacion"
                                            value={field.state.value ?? ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Barrio, ciudad, provincia"
                                        />
                                        {formErrors.ubicacion && (
                                            <p className="text-red-700 text-sm">{formErrors.ubicacion}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <div>
                            <form.Field name="precio">
                                {(field) => (
                                    <div>
                                        <Label className="font-semibold mb-2" htmlFor="precio">
                                            Precio
                                        </Label>
                                        <Input
                                            id="precio"
                                            type="number"
                                            inputMode="numeric"
                                            value={field.state.value ?? ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="₡1 400 000"
                                            min={1}
                                            step={1}
                                        />
                                        {formErrors.precio && (
                                            <p className="text-red-700 text-sm">{formErrors.precio}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <form.Field
                            name="idTipoInmueble"
                            children={(field) => (
                                <div>
                                    <Label className="font-semibold mb-2" htmlFor="tipoInmueble">
                                        Tipo de inmueble
                                    </Label>
                                    <Select
                                        value={field.state.value ? field.state.value.toString() : ""}
                                        onValueChange={(value) => field.handleChange(Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo de inmueble" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {propertyTypes.map((tipo) => (
                                                <SelectItem
                                                    key={tipo.idTipoInmueble}
                                                    value={tipo.idTipoInmueble.toString()}
                                                >
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors.tipoUnidadMedida && (
                                        <p className="text-red-700 text-sm">{formErrors.tipoUnidadMedida}</p>
                                    )}
                                </div>
                            )}
                        />

                        <form.Field
                            name="idEstado"
                            children={(field) => (
                                <div>
                                    <Label className="font-semibold mb-2" htmlFor="estadoPropiedad">
                                        Estado de la propiedad
                                    </Label>
                                    <Select
                                        value={field.state.value ? field.state.value.toString() : ""}
                                        onValueChange={(value) => field.handleChange(Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {propertyStatuses.map((estado) => (
                                                <SelectItem
                                                    key={estado.idEstadoPropiedad}
                                                    value={estado.idEstadoPropiedad.toString()}
                                                >
                                                    {estado.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors.estadoPropiedad && (
                                        <p className="text-red-700 text-sm">{formErrors.estadoPropiedad}</p>
                                    )}
                                </div>
                            )}
                        />

                        <div className="space-y-2 rounded-md border p-3">
                            <Label className="font-semibold">Asignar propietario</Label>

                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="buscarCedula" className="text-sm">
                                        Buscar por cédula (mín. 3 dígitos)
                                    </Label>
                                    <Input
                                        id="buscarCedula"
                                        placeholder="Ej. 1 2345 6789"
                                        value={cedulaQuery}
                                        onChange={(e) => setCedulaQuery(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCedulaQuery("")}
                                >
                                    Limpiar
                                </Button>
                            </div>

                            <form.Field name="identificacion">
                                {(field) => (
                                    <div>
                                        <Label className="text-sm mb-1">Seleccionar cliente</Label>
                                        <Select
                                            value={field.state.value ? String(field.state.value) : ""}
                                            onValueChange={(v) => field.handleChange(Number(v))}
                                            disabled={cargandoClientes}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        cargandoClientes
                                                            ? "Cargando clientes…"
                                                            : usarBusqueda
                                                                ? "Selecciona el cliente encontrado"
                                                                : "Selecciona un cliente"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opcionesClientes?.length > 0 ? (
                                                    opcionesClientes.map((c: ClientSearchPreview) => (
                                                        <SelectItem
                                                            key={c.identificacion}
                                                            value={String(c.identificacion)}
                                                        >
                                                            {c.nombreCompleto ||
                                                                [c.nombre, c.apellido1, c.apellido2]
                                                                    .filter(Boolean)
                                                                    .join(" ") ||
                                                                ""}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-1 text-sm opacity-70">
                                                        {usarBusqueda
                                                            ? "No se encontraron clientes con esa cédula."
                                                            : errorClientes
                                                                ? "Error cargando clientes."
                                                                : "Sin clientes para mostrar."}
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>

                                        {(fetchingClientes || fetchingCliente) && (
                                            <p className="text-xs opacity-60 mt-1">Actualizando lista…</p>
                                        )}
                                        {errorCliente && (
                                            <p className="text-red-700 text-sm mt-1">
                                                Ocurrió un error al buscar por cédula.
                                            </p>
                                        )}
                                        {formErrors.identificacion && (
                                            <p className="text-red-700 text-sm mt-1">
                                                {formErrors.identificacion}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                            <p className="text-xs text-muted-foreground">
                                Consejo: escribe la cédula para filtrar, o déjalo vacío para ver el listado
                                completo.
                            </p>
                        </div>

                        {formError && (
                            <p className="text-red-700 text-sm text-center">{formError}</p>
                        )}

                        <DialogFooter className="flex gap-2">
                            <Button type="submit">
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

export default FormCrearPropiedad;
