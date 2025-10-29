import { requiredInt } from "@/utils/validators";
import { z } from "zod";

export const zDate = z.string().min(1, "Fecha obligatoria");
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
  fechaFirma: zDate,
  fechaPago: zDate,
  idPropiedad: zIntId,
  idAgente: zIntId,
  montoTotal: zMoneyGE1,
  porcentajeComision: zPercent,
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  deposito: zMoneyGE0.optional(),
  cantidadPagos: z.number().optional(),
});

export const datosAlquilerSchema = z.object({
  fechaInicio: zDate,
  cantidadPagos: z.number("Cantidad de pagos obligatoria")
    .int("Debe ser entero")
    .min(1, "Debe ser al menos 1"),
  fechaFirma: zDate,
  fechaPago: zDate,
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
  fechaFirma: zDate,
  fechaPago: zDate,
  idTipoContrato: zIntId,
  idPropiedad: zIntId,
  idAgente: zIntId,
  montoTotal: zMoneyGE1,
  porcentajeComision: zPercent,
  condicionesTexto: z.string().optional().default(""),
});

export const submitVentaSchema = baseSubmit.extend({
  fechaInicio: zDate.optional(),
  fechaFin: zDate.optional(),
  deposito: zMoneyGE0.optional(),
});

export const submitAlquilerSchema = baseSubmit.extend({
  fechaInicio: zDate,
  fechaFin: zDate,
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
