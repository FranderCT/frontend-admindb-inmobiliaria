import { asNumber, requiredInt } from "@/utils/validators";
import { z } from "zod";

export const createPropertySchema = z.object({
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  precio: asNumber("Ingresa el precio").refine((n) => n >= 1, "El precio debe ser ≥ 1"),
  idTipoInmueble: requiredInt("Selecciona un tipo de inmueble"),
  idEstado: requiredInt("Selecciona el estado"),
  identificacion: requiredInt("Selecciona un propietario"),
});

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;
