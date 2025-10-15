import { asBoolean, emptyToUndef, requiredInt } from "@/utils/validators";
import { z } from "zod";

export const createClientSchema = z.object({
  identificacion: requiredInt("La identificación es obligatoria"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido1: z.string().min(1, "El primer apellido es obligatorio"),
  apellido2: emptyToUndef,
  telefono: emptyToUndef,
});

export const editClientSchema = z.object({
  identificacion: requiredInt("La identificación es obligatoria"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido1: z.string().min(1, "El primer apellido es obligatorio"),
  apellido2: emptyToUndef.optional(), 
  telefono: emptyToUndef.refine(
    (v) => !v || /^\d{8}$/.test(v), 
    "El teléfono debe tener 8 dígitos"
  ),
  estado: asBoolean, 
});

export type EditClientPayload = z.infer<typeof editClientSchema>;

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
