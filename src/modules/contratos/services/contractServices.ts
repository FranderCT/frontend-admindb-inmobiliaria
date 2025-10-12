import altosDelValleAPI from "@/api/altosdelvalle";
import { Contract, ContractParticipantsPayload, ContractType, CreateContract, RoleType } from "../models/contract";

export const createContract = async (contract: CreateContract): Promise<CreateContract> => {
  const response = await altosDelValleAPI.post<CreateContract>(
    `/contrato`,
    contract
  );
  return response.data;
};

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

export async function assignContractParticipants(payload: ContractParticipantsPayload) {
  const { data } = await altosDelValleAPI.post("/cliente-contrato/varios-clientes", payload);
  return data;
}