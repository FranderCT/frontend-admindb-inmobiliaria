import { requiredInt, requiredMoneyGE1, requiredPercent } from "@/utils/validators";
import { z } from "zod";

export const createContractSchema = z.object({
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fechaFin: z.string().min(1, "La fecha de fin es obligatoria"),
  fechaFirma: z.string().min(1, "La fecha de firma es obligatoria"),
  fechaPago: z.string().min(1, "La fecha de pago es obligatoria"),

  idTipoContrato: requiredInt("Selecciona un tipo de contrato"),
  idPropiedad: requiredInt("Selecciona una propiedad"),
  idAgente: requiredInt("Selecciona un agente"),

  montoTotal: requiredMoneyGE1("Ingresa el monto total"),
  deposito: requiredMoneyGE1("Ingresa el depósito"),

  porcentajeComision: requiredPercent("Ingresa el porcentaje de comisión"),

  condicionesTexto: z.string().optional().default(""),
});

export type CreateContractFormValues = z.infer<typeof createContractSchema>;


export const participantRowSchema = z.object({
  identificacion: requiredInt("Selecciona un cliente"),
  idRol: requiredInt("Selecciona un rol"),
});

export const assignParticipantsSchema = z.object({
  idContrato: requiredInt("Debes agregar un contrato"),
  participantes: z.array(participantRowSchema).min(2, "Selecciona al menos dos participantes"),
});

export type AssignParticipantsInput = z.infer<typeof assignParticipantsSchema>;
