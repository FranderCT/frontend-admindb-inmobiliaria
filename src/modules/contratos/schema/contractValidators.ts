import { z } from "zod";

const asNumber = (requiredMsg: string) =>
  z.preprocess(
    (v) => (v ?? ""), // undefined/null -> ""
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

const requiredMoneyGE1 = (msg: string) =>
  asNumber(msg).refine((n) => n >= 1, msg);

const requiredPercent = (msg: string) =>
  asNumber(msg)
    .refine((n) => n >= 0, "No puede ser negativo")
    .refine((n) => n <= 100, "No puede ser mayor a 100");

export const createContractSchema = z.object({
  // Fechas (requeridas)
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fechaFin: z.string().min(1, "La fecha de fin es obligatoria"),
  fechaFirma: z.string().min(1, "La fecha de firma es obligatoria"),
  fechaPago: z.string().min(1, "La fecha de pago es obligatoria"),

  // IDs (>0, enteros)
  idTipoContrato: requiredInt("Selecciona un tipo de contrato"),
  idPropiedad: requiredInt("Selecciona una propiedad"),
  idAgente: requiredInt("Selecciona un agente"),

  // Montos (>= 1 según tu regla actual)
  montoTotal: requiredMoneyGE1("Ingresa el monto total"),
  deposito: requiredMoneyGE1("Ingresa el depósito"),

  // % [0, 100]
  porcentajeComision: requiredPercent("Ingresa el porcentaje de comisión"),

  // Libre (opcional)
  condicionesTexto: z.string().optional().default(""),
});

export type CreateContractFormValues = z.infer<typeof createContractSchema>;


// ---- schemas ----
export const participantRowSchema = z.object({
  identificacion: requiredInt("Selecciona un cliente"),
  idRol: requiredInt("Selecciona un rol"),
});

export const assignParticipantsSchema = z.object({
  idContrato: requiredInt("Falta el id del contrato"),
  participantes: z.array(participantRowSchema).min(1, "Selecciona al menos un participante"),
});

export type AssignParticipantsInput = z.infer<typeof assignParticipantsSchema>;
