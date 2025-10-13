import altosDelValleAPI from "@/api/altosdelvalle";
import { AgentPreview, Contract, ContractParticipantsPayload, ContractType, CreateContract, RoleType } from "../models/contract";
import { normalize, RawAgent } from "../types/contractTypes";

export const createContract = async (contract: CreateContract): Promise<CreateContract> => {
  const response = await altosDelValleAPI.post<CreateContract>(
    `/contrato`,
    contract
  );
  return response.data;
};

export async function assignContractParticipants(payload: ContractParticipantsPayload) {
  const { data } = await altosDelValleAPI.post("/cliente-contrato/varios-clientes", payload);
  return data;
}
export const getContracts = async (): Promise<Contract[]> => {
  const response = await altosDelValleAPI.get<Contract[]>(`/contrato`);
  return response.data;
};


export const getContractRoleType = async (): Promise<RoleType[]> => {
    const response = await altosDelValleAPI.get<RoleType[]>(`/tipo-rol`);
    return response.data;
};


export const getContractType = async (): Promise<ContractType[]> => {
    const response = await altosDelValleAPI.get<ContractType[]>(`/tipo-contrato`);
    return response.data;
};

export const getAgentsPreview = async (identificacion?: string): Promise<AgentPreview[]> => {
  const ced = (identificacion ?? "").trim();

  // SIN parámetro => listado
  if (ced.length < 3) {
    const { data } = await altosDelValleAPI.get<RawAgent[] | RawAgent>("/agente/nombres");
    return normalize(data);
  }

  // CON parámetro => búsqueda
  const { data } = await altosDelValleAPI.get<RawAgent[] | RawAgent>("/agente/nombres", {
    params: { identificacion: ced },
  });
  return normalize(data);
};