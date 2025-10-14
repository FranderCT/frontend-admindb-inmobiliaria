import altosDelValleAPI from "@/api/altosdelvalle";
import { Agent, AgentesPaginateParams, CreateAgent, UpdateAgent } from "../models/agent";

/** Crear agente */
export const createAgent = async (agent: CreateAgent): Promise<Agent> => {
  const { data } = await altosDelValleAPI.post<Agent>("/agente/crear", agent);
  return data;
};

export type AgentsListParams = {
  page?: number;
  limit?: number;
  sortCol?: string;
  sortDir?: "ASC" | "DESC";
  q?: string;
  estado?: 0 | 1 | string | undefined;
};

export const getAgents = async (
  params?: AgentsListParams
): Promise<any> => {
  let url = "/agente/todos";

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

export const getClientsFiltered = async (params: AgentesPaginateParams) => {
  const { data } = await altosDelValleAPI.get("/cliente/paginate", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,                 // ← 10 como en tu curl
      sortCol: params.sortCol ?? "identificacion",
      sortDir: params.sortDir ?? "ASC",
      // solo envía q si existe
      ...(params.q ? { q: params.q } : {}),
      // estado solo si es number (0|1)
      ...(typeof params.estado === "number" ? { estado: params.estado } : {}),
    },
  });
  return data;
};
/** Obtener por identificación */
export const getAgent = async (identificacion: string): Promise<Agent | null> => {
  const { data } = await altosDelValleAPI.get<Agent>(`/agente/${identificacion}`);
  return data;
};

/** “Eliminar” (desactivar) */
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

/** Actualizar */
type UpdateAgentPayload = UpdateAgent & { identificacion: string | number };

export const updateAgent = async (payload: UpdateAgentPayload): Promise<{ ok: boolean }> => {
  const { identificacion, ...dto } = payload;
  const id = String(identificacion);
  const { data } = await altosDelValleAPI.patch<{ ok: boolean }>(
    `/agente/${id}`,
    dto
  );
  return data;
};
