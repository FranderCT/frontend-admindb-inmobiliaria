import { z } from "zod";

const asNumber = (requiredMsg: string) =>
  z.preprocess(
    (v) => (v ?? ""), 
    z.union([z.string(), z.number()])
      .transform((v) => {
        if (typeof v === "number") return v;
        const t = v.trim();
        if (t === "") return NaN;
        const n = Number(t);
        return Number.isNaN(n) ? NaN : n;
      })
      .refine((n) => !Number.isNaN(n), requiredMsg)
  );

const requiredInt = (msg: string) =>
  asNumber(msg)
    .refine((n) => Number.isInteger(n), "Debe ser un número entero")
    .refine((n) => n > 0, "Debe ser mayor a 0");

const emptyToUndef = z
  .string()
  .transform((s) => (s.trim() === "" ? undefined : s.trim()))
  .optional();

export const createClientSchema = z.object({
  identificacion: requiredInt("La identificación es obligatoria"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido1: z.string().min(1, "El primer apellido es obligatorio"),
  apellido2: emptyToUndef,
  telefono: emptyToUndef,
});

export type CreateClientFormValues = z.infer<typeof createClientSchema>;

const asBoolean = z.preprocess(
  (v) => (v === 1 || v === "1" || v === true ? true : false),
  z.boolean()
);

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
