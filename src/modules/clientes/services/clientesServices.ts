import altosDelValleAPI from "@/api/altosdelvalle";
import { Client, CreateClient } from "../models/client";

// post

export const createCliente = async ( cliente: CreateClient ): Promise<CreateClient> => {
  const response = await altosDelValleAPI.post<CreateClient>(
    `/cliente`,
    cliente
  );
  return response.data;
};



export const getClientes = async (): Promise<Client[]> => {
    const response = await altosDelValleAPI.get<Client[]>(`cliente/all`);
    return response.data;
};