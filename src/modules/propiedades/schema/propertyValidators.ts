import { asNumber, requiredInt } from "@/utils/validators";
import { z } from "zod";

export const createPropertySchema = z.object({
  ubicacion: z.string().min(1, "La ubicación es obligatoria").max(100, "La ubicación es muy larga"),
  precio: asNumber("Ingresa el precio").refine((n) => n >= 1, "El precio debe ser ≥ 1"),
  idTipoInmueble: requiredInt("Selecciona un tipo de inmueble"),
  idEstado: requiredInt("Selecciona el estado"),
  identificacion: requiredInt("Selecciona un propietario"),
});

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;

export const MAX_PRICE = 100_000_000_000_000; 
export const MAX_DIGITS = String(MAX_PRICE).length;