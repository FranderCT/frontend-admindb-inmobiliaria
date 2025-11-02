import altosDelValleAPI from "@/api/altosdelvalle";
import { AgentPreview, AvailableProperty, Contract, ContractDetails, ContractParticipant, ContractParticipantsPayload, ContractsPaginateParams, ContractsPaginateResponse, ContractType, CreateContract, RoleType, UpdateContract } from "../models/contract";
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

export const getContracts = async (
  p: ContractsPaginateParams
): Promise<ContractsPaginateResponse> => {
  const params: Record<string, unknown> = {
    pagina: p.page ?? 1,
    cantidadPorPagina: p.limit ?? 10,
    ordenarPor: p.sortCol ?? "fechaInicio",
    direccionOrden: p.sortDir ?? "ASC",
  };

  if (p.q) params.q = p.q;
  if (typeof p.estado === "number") params.estado = p.estado;
  if (p.tipoContratoId != null) params.idTipoContrato = Number(p.tipoContratoId);
  if (p.agenteId != null) params.idAgente = Number(p.agenteId);
  if (p.propiedadId != null) params.idPropiedad = Number(p.propiedadId);

  const { data } = await altosDelValleAPI.get<ContractsPaginateResponse>(
    "/contrato/vista-previa",
    { params }
  );
  return data;
};

export const getContract = async (idContrato: number): Promise<ContractDetails> => {
  const response = await altosDelValleAPI.get<ContractDetails>(`/contrato/vista/${idContrato}`);
  return response.data;
};
export const getContractPrev = async (idContrato: number): Promise<Contract> => {
  const response = await altosDelValleAPI.get<Contract>(`/contrato/vista-previa/${idContrato}`);
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

  if (ced.length < 3) {
    const { data } = await altosDelValleAPI.get<RawAgent[] | RawAgent>("/agente/nombres");
    return normalize(data);
  }

  const { data } = await altosDelValleAPI.get<RawAgent[] | RawAgent>("/agente/nombres", {
    params: { identificacion: ced },
  });
  return normalize(data);
};

export const getAvailableProperties = async (): Promise<AvailableProperty[]> => {
  const response = await altosDelValleAPI.get<AvailableProperty[]>(`/propiedad/available-properties`);
  return response.data;
};

export const getContractParticipants = async (idContrato: number): Promise<ContractParticipant[]> => {
  const response = await altosDelValleAPI.get<ContractParticipant[]>
  (`/cliente-contrato/contrato/${idContrato}`);
  return response.data;
};

//patch

export const patchUpdateContract = async (data: UpdateContract): Promise<{ ok: boolean }> => {
  const response = await altosDelValleAPI.patch<{ ok: boolean }>(`contrato/${data.idContrato}`, data);
  return response.data;
}

export const updateContractParticipants = async (payload: ContractParticipantsPayload) => {
  const { data } = await altosDelValleAPI.patch("/cliente-contrato", payload);
  return data;
}