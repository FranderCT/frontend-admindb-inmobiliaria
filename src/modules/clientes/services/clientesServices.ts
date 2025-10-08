import altosDelValleAPI from "@/api/altosdelvalle";
import { Client, CreateClient, UpdateClient } from "../models/client";
import { ClientesPaginateParams, ClientesPaginateResponse } from "../types/clientTypes";

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
export const getCliente = async (identificacion: string): Promise<Client | null> => {
    const response = await altosDelValleAPI.get<Client>(`cliente/${identificacion}`);
    return response.data;
};

export const getClientesPaginate = async (
  params: ClientesPaginateParams = {}
): Promise<ClientesPaginateResponse> => {
  const {
    page = 1,
    limit = 10,
    sortCol = "identificacion",
    sortDir = "ASC",
    q = "",
    estado,
  } = params;

  const response = await altosDelValleAPI.get<ClientesPaginateResponse>(
    "cliente/paginate",
    {
      params: { page, limit, sortCol, sortDir, q, estado },
    }
  );

  return response.data;
};

export const deleteCliente = async (identificacion: string): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.delete<{ ok: boolean }>(`cliente/${identificacion}`);
    return response.data;
};

export const updateCliente = async (data: UpdateClient): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.put<{ ok: boolean }>(`cliente`, data);
    return response.data;
};