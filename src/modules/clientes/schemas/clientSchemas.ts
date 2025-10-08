import { z } from "zod";

export const createClienteSchema = z.object({
  identificacion: z.coerce
    .number()
    .int({ message: "La cédula debe ser un número entero" })
    .positive({ message: "La cédula debe ser positiva" }),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido1: z.string().min(2, "El primer apellido es obligatorio"),
  apellido2: z.string().optional().or(z.literal("")),
  telefono: z
    .string()
    .min(8, "El teléfono es muy corto")
    .max(20, "El teléfono es muy largo")
    .regex(/^[0-9+\-\s]+$/, "Formato de teléfono inválido"),
});


export type CreateClient = z.infer<typeof createClienteSchema>;
