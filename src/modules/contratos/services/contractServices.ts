import altosDelValleAPI from "@/api/altosdelvalle";
import { Contract, CreateContract } from "../models/contract";

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

