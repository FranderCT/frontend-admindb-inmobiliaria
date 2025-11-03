import { useState, useMemo } from "react";
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
import { ImageUp, Plus } from "lucide-react";
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
import { useDebounced } from "@/utils/debounce";
import { createPropertySchema, MAX_DIGITS, MAX_PRICE } from "../schema/propertyValidators";

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

            const result = createPropertySchema.safeParse(value);
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
        }
    });

    return (
        <>
            <Button variant="default" onClick={() => setOpen(true)}>
                <Plus /> Agregar propiedad
            </Button>

            <Dialog open={open} onClose={setOpen}>
                <DialogPanel className="sm:max-w-lg ">
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
                                                field.handleChange(raw);
                                            }}
                                            placeholder="₡1 400 000"
                                            aria-invalid={!!formErrors.precio}
                                            className={formErrors.precio ? "border-red-600" : ""}
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
                        >
                            {(field) => (
                                <div>
                                    <Label className="font-semibold mb-2" htmlFor="tipoInmueble">
                                        Tipo de inmueble
                                    </Label>
                                    <Select
                                        value={field.state.value ? field.state.value.toString() : ""}
                                        onValueChange={(value) => field.handleChange(Number(value))}
                                    >
                                        <SelectTrigger
                                        >
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
                                    {formErrors.idTipoInmueble && (
                                        <p className="text-red-700 text-sm">{formErrors.idTipoInmueble}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field
                            name="idEstado"
                        >
                            {(field) => (
                                <div>
                                    <Label className="font-semibold mb-2" htmlFor="estadoPropiedad">
                                        Estado de la propiedad
                                    </Label>
                                    <Select
                                        value={field.state.value ? field.state.value.toString() : ""}
                                        onValueChange={(value) => field.handleChange(Number(value))}
                                    >
                                        <SelectTrigger
                                        >
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
                                    {formErrors.idEstado && (
                                        <p className="text-red-700 text-sm">{formErrors.idEstado}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <div className="space-y-2 rounded-md border p-3">
                            <Label className="font-semibold">Asignar propietario</Label>

                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="buscarCedula" className="text-sm">
                                        Buscar por cédula
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
                                        <Label className="text-sm mb-1">Seleccionar propietario</Label>
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
                        <form.Field
                            name="imagen"
                            validators={{
                                onChange: ({ value }) =>
                                    value && value instanceof File && !value.type.startsWith("image/")
                                        ? "Seleccione un archivo de imagen"
                                        : undefined,
                            }}
                        >
                            {(field) => (
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">Imagen (opcional)</Label>
                                    <div className="relative flex items-center">
                                        <label
                                            htmlFor="imagen-propiedad"
                                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 text-sm rounded-lg border border-gray-200 shadow cursor-pointer hover:bg-gray-100"
                                        >
                                            <ImageUp className="h-4 w-4" />
                                            Seleccionar imagen
                                            <Input
                                                id="imagen-propiedad"
                                                name="imagen"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) field.handleChange(file);
                                                }}
                                                className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
                                                style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0 }}
                                            />
                                        </label>
                                        {field.state.value && typeof field.state.value === "object" && (
                                            <span className="ml-3 max-w-xs truncate text-sm text-muted-foreground">
                                                {(field.state.value as File).name}
                                            </span>
                                        )}
                                    </div>
                                    {formErrors.identificacion && (
                                        <p className="text-red-700 text-sm mt-1">
                                            {formErrors.imagen}
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>

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
