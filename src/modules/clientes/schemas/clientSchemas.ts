import { asBoolean, emptyToUndef, requiredInt } from "@/utils/validators";
import { z } from "zod";

export const createClientSchema = z.object({
  identificacion: requiredInt("La identificación es obligatoria"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido1: z.string().min(1, "El primer apellido es obligatorio").max(30, "El primer apellido es muy largo"),
  apellido2: z.string().min(2, "El segundo apellido es obligatorio").max(30, "El segundo apellido es muy largo"),
  telefono: requiredInt("El teléfono es obligatorio"),
});

export const editClientSchema = z.object({
  identificacion: requiredInt("La identificación es obligatoria"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido1: z.string().min(1, "El primer apellido es obligatorio").max(30, "El primer apellido es muy largo"),
  apellido2: z.string().min(2, "El segundo apellido es obligatorio").max(30, "El segundo apellido es muy largo"),
  telefono: requiredInt("El teléfono es obligatorio"),
  estado: asBoolean,
});

export type EditClientPayload = z.infer<typeof editClientSchema>;

export type CreateClientFormValues = z.infer<typeof createClientSchema>;
