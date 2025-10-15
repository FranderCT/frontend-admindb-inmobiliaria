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

export const createPropertySchema = z.object({
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  precio: asNumber("Ingresa el precio").refine((n) => n >= 1, "El precio debe ser ≥ 1"),
  idTipoInmueble: requiredInt("Selecciona un tipo de inmueble"),
  idEstado: requiredInt("Selecciona el estado"),
  identificacion: requiredInt("Selecciona un propietario"),
});

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;
