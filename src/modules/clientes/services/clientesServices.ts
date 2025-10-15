import altosDelValleAPI from "@/api/altosdelvalle";
import { Client, CreateClient, UpdateClient } from "../models/client";
import { ClientesPaginateParams } from "../types/clientTypes";

// post

export const createClient = async ( client: CreateClient ): Promise<CreateClient> => {
  const response = await altosDelValleAPI.post<CreateClient>(
    `/cliente`,
    client
  );
  return response.data;
};

// get
export const getClients = async (): Promise<Client[]> => {
    const response = await altosDelValleAPI.get<Client[]>(`cliente/all`);
    return response.data;
};


export const getClient = async (identificacion: string): Promise<Client | null> => {
    const response = await altosDelValleAPI.get<Client>(`cliente/${identificacion}`);
    return response.data;
};

export const getClientsFiltered = async (params: ClientesPaginateParams) => {
  const { data } = await altosDelValleAPI.get("/cliente/paginate", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      sortCol: params.sortCol ?? "identificacion",
      sortDir: params.sortDir ?? "ASC",
      ...(params.q ? { q: params.q } : {}),
      ...(typeof params.estado === "number" ? { estado: params.estado } : {}),
    },
  });
  return data;
};

//delete
export const deleteClient = async (identificacion: string): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.delete<{ ok: boolean }>(`cliente/${identificacion}`);
    return response.data;
};

//put
export const updateClient = async (data: UpdateClient): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.put<{ ok: boolean }>(`cliente`, data);
    return response.data;
};