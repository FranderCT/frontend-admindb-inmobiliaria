import altosDelValleAPI from "@/api/altosdelvalle";
import type { Agent, CreateAgent, UpdateAgent } from "../models/agent";


export type AgentsListParams = {
  page?: number;
  limit?: number;
  sortCol?: string;
  sortDir?: "ASC" | "DESC";
  q?: string;
  estado?: 0 | 1 | string | undefined;
};

type UpdateAgentPayload = UpdateAgent & { identificacion: string | number };


export const createAgent = async (agent: CreateAgent): Promise<Agent> => {
  const { data } = await altosDelValleAPI.post<Agent>("/agente/crear", agent);
  return data;
};

export const getAgents = async (params?: AgentsListParams): Promise<any> => {
  let url = "/agente/paginate";

  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams();

    if (params.page != null) qs.set("page", String(params.page));
    if (params.limit != null) qs.set("limit", String(params.limit));
    if (params.sortCol) qs.set("sortCol", params.sortCol);
    if (params.sortDir) qs.set("sortDir", params.sortDir);
    if (params.q) qs.set("q", params.q);
    if (params.estado != null) {
      const estado =
        typeof params.estado === "string"
          ? Number(params.estado)
          : params.estado;
      if (estado === 0 || estado === 1) qs.set("estado", String(estado));
    }

    const query = qs.toString();
    if (query) url = `${url}?${query}`;
  }

  const { data } = await altosDelValleAPI.get<any>(url);
  return data; 
};

export const getActiveAgents = async (): Promise<Agent[]> => {
  const { data } = await altosDelValleAPI.get<Agent[]>("/agente/activos");
  return data;
};

export const getInactiveAgents = async (): Promise<Agent[]> => {
  const { data } = await altosDelValleAPI.get<Agent[]>("/agente/inactivos");
  return data;
};

export const getAgentNames = async (
  identificacion?: string | number
): Promise<any> => {
  const params =
    identificacion !== undefined && identificacion !== null
      ? { identificacion }
      : undefined;

  const { data } = await altosDelValleAPI.get<any>("/agente/nombres", {
    params,
  });
  return data;
};


export const getAgent = async (
  identificacion: string | number
): Promise<Agent | null> => {
  const id = encodeURIComponent(String(identificacion).trim());
  const { data } = await altosDelValleAPI.get<Agent>(`/agente/${id}`);
  return data;
};


export const deleteAgent = async (
  identificacion: string | number
): Promise<{ ok: boolean }> => {
  const id = encodeURIComponent(String(identificacion).trim());
  const { data } = await altosDelValleAPI.patch<{ ok: boolean }>(
    `/agente/${id}/desactivar`,
    {} 
  );
  return data ?? { ok: true };
};

export const activateAgent = async (
  identificacion: string | number
): Promise<{ ok: boolean }> => {
  const id = encodeURIComponent(String(identificacion).trim());
  const { data } = await altosDelValleAPI.patch<{ ok: boolean }>(
    `/agente/${id}/activar`,
    {}
  );
  return data ?? { ok: true };
};


export const updateAgent = async (
  payload: UpdateAgentPayload
): Promise<{ ok: boolean }> => {
  const { identificacion, ...dto } = payload;
  const id = encodeURIComponent(String(identificacion).trim());
  const { data } = await altosDelValleAPI.patch<{ ok: boolean }>(
    `/agente/${id}`,
    dto
  );
  return data;
};

