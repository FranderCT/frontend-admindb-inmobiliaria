import { requiredInt } from "@/utils/validators";
import { z, ZodIssue, ZodIssueCode } from "zod";

export const zIntId = z.number("Selecciona un valor" )
  .int("Debe ser entero")
  .positive("Debe ser mayor a 0");

export const zMoneyGE0 = z.number("Ingresa un monto")
  .min(0, "Debe ser >= 0");
export const zMoneyGE1 = z.number("Ingresa un monto")
  .min(1, "Debe ser >= 1");

export const zPercent = z.number("Ingresa un porcentaje")
  .min(0, "Debe ser >= 0")
  .max(100, "Debe ser <= 100");

export const datosVentaSchema = z.object({
  fechaFirma: z.string(),
  idPropiedad: zIntId,
  idAgente: zIntId,
  montoTotal: zMoneyGE1,
  porcentajeComision: zPercent,
  fechaInicio: z.string(),
  fechaFin: z.string(),
  deposito: zMoneyGE0.optional(),
});

export const datosAlquilerSchema = z.object({
  fechaInicio: z.string(),
  cantidadPagos: z.number("Cantidad de pagos obligatoria")
    .int("Debe ser entero")
    .min(1, "Debe ser al menos 1"),
  fechaFirma: z.string(),
  fechaPago: z.string(),
  idPropiedad: zIntId,
  idAgente: zIntId,
  montoTotal: zMoneyGE1,
  deposito: zMoneyGE0,
  porcentajeComision: zPercent,
  fechaFin: z.string().optional(),
});

export type DatosVenta = z.infer<typeof datosVentaSchema>;
export type DatosAlquiler = z.infer<typeof datosAlquilerSchema>;


const baseSubmit = z.object({
  fechaFirma: z.string(),
  fechaPago: z.string(),
  idTipoContrato: zIntId,
  idPropiedad: zIntId,
  idAgente: zIntId,
  montoTotal: zMoneyGE1,
  porcentajeComision: zPercent,
  condicionesTexto: z.string().optional().default(""),
});

export const submitVentaSchema = baseSubmit.extend({
  fechaInicio: z.string(),
  fechaFin: z.string(),
  deposito: zMoneyGE0.optional(),
});

export const submitAlquilerSchema = baseSubmit.extend({
  fechaInicio: z.string(),
  fechaFin: z.string(),
  deposito: zMoneyGE0,
  cantidadPagos: z.number().int().min(1),
});

export type SubmitVenta = z.infer<typeof submitVentaSchema>;
export type SubmitAlquiler = z.infer<typeof submitAlquilerSchema>;


export const participantRowSchema = z.object({
  identificacion: requiredInt("Selecciona un cliente"),
  idRol: requiredInt("Selecciona un rol"),
});

export const assignParticipantsSchema = z.object({
  idContrato: requiredInt("Debes agregar un contrato"),
  participantes: z.array(participantRowSchema).min(2, "Selecciona al menos dos participantes"),
});

export type AssignParticipantsInput = z.infer<typeof assignParticipantsSchema>;

const FIELD_LABELS: Record<string, string> = {
  fechaInicio: "Fecha de inicio",
  fechaFin: "Fecha de fin",
  fechaFirma: "Fecha de firma",
  fechaPago: "Fecha de pago",
  idTipoContrato: "Tipo de contrato",
  idPropiedad: "Propiedad",
  idAgente: "Agente",
  montoTotal: "Monto total",
  deposito: "Depósito",
  porcentajeComision: "% de comisión",
  condicionesTexto: "Condiciones",
  cantidadPagos: "Cantidad de pagos",
};

const labelFor = (k: string) => FIELD_LABELS[k] ?? k;

export function prettyIssue(issue: ZodIssue, fieldName?: string) {
  if (issue.message) return issue.message;

  const label = labelFor(fieldName ?? issue.path.join("."));
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      return `“${label}” no es válido.`;
    case ZodIssueCode.too_small:
      return `“${label}” es demasiado pequeño.`;
    case ZodIssueCode.too_big:
      return `“${label}” es demasiado grande.`;
    default:
      return `“${label}” no es válido.`;
  }
}

export function mapIssuesByField(issues: ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const path = issue.path.join(".");
    const msg = prettyIssue(issue, path);
    if (!out[path]) out[path] = msg; // primera por campo
  }
  return out;
}