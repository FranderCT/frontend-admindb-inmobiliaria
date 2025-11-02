import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignContractParticipants, createContract, getAgentsPreview, getAvailableProperties, getContract, getContractParticipants, getContractPrev, getContractRoleType, getContracts, getContractType, patchUpdateContract, updateContractParticipants } from "../services/contractServices";
import { AgentPreview, ContractParticipant, ContractParticipantsPayload, ContractsPaginateParams, ContractsPaginateResponse, CreateContract, UpdateContract } from "../models/contract";

export const useCreateContract = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            contract,
        }: {
            contract: CreateContract;
        }) => createContract(contract),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["contracts","contract"],
            });
        },
    });
};

export const useAssignContractParticipants = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: ContractParticipantsPayload) => assignContractParticipants(payload),
        onSuccess: (_d, vars) => {
            const idContrato = vars.participantes?.[0]?.idContrato;
            qc.invalidateQueries({ queryKey: ["contracts"] });
            qc.invalidateQueries({ queryKey: ["contractParticipants", idContrato] });
        },
    });
};

export function useGetContracts(params: ContractsPaginateParams) {
    const normalized: ContractsPaginateParams = {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortCol: params.sortCol ?? "fechaInicio",
        sortDir: params.sortDir ?? "ASC",
        q: params.q ?? "",
        estado:
            typeof params.estado === "string"
                ? (Number(params.estado) as 0 | 1)
                : params.estado,
        tipoContratoId:
            params.tipoContratoId != null ? Number(params.tipoContratoId) : undefined,
        agenteId: params.agenteId != null ? Number(params.agenteId) : undefined,
        propiedadId:
            params.propiedadId != null ? Number(params.propiedadId) : undefined,
    };

    return useQuery<ContractsPaginateResponse>({
        queryKey: ["contracts", "paginate", normalized],
        queryFn: () => getContracts(normalized),
        staleTime: 60_000,
    });
}


export function useGetContract(idContrato: number) {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["contract", idContrato],
        queryFn: () => getContract(idContrato),
    });

    return {
        contract: data,
        loadingContract: isLoading,
        fetchingContract: isFetching,
        errorContract: error,
    };
}

export function useGetContractPrev(idContrato?: number, opts?: { enabled?: boolean }) {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["contract", idContrato],
        queryFn: () => getContractPrev(idContrato),
        ...opts,
    });

    return {
        contrato: data,
        loadingContrato: isLoading,
        fetchingContrato: isFetching,
        errorContrato: error,
    };
}

export function useGetContractRoleType() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["contractRoleType"],
        queryFn: () => getContractRoleType(),
    });

    return {
        contractRoleTypes: data,
        loadingContractRoleTypes: isLoading,
        fetchingContractRoleTypes: isFetching,
        errorContractRoleTypes: error,
    };
}

export function useGetContractType() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["contractType"],
        queryFn: () => getContractType(),
    });

    return {
        contractTypes: data,
        loadingContractTypes: isLoading,
        fetchingContractTypes: isFetching,
        errorContractTypes: error,
    };
}

export function useGetAgentPreview(identificacion?: string) {
  const ced = identificacion?.trim() ?? "";
  const key = ["agent-preview", ced.length >= 3 ? ced : "list"];

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: key,
    queryFn: () => getAgentsPreview(ced.length >= 3 ? ced : undefined),
    staleTime: 60_000,
  });

  return {
    agents: (data ?? []) as AgentPreview[],
    loadingAgents: isLoading,
    fetchingAgents: isFetching,
    errorAgents: error,
  };
}
export function useGetAvailableProperties() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["availableProperties"],
        queryFn: () => getAvailableProperties(),
    });

    return {
        availableProperties: data,
        loadingAvailableProperties: isLoading,
        fetchingAvailableProperties: isFetching,
        errorAvailableProperties: error,
    };
}
export function useGetContractParticipants(idContrato: number) {
  const { data, isLoading, isFetching, isError, error } = useQuery<ContractParticipant[], Error>({
    queryKey: ['contrato', idContrato, 'participantes'],
    queryFn: () => getContractParticipants(idContrato),
    enabled: !!idContrato,
    staleTime: 30_000,
  })

  const participantes = data ?? []
  const participantesCount = participantes.length
  const tieneParticipantes = participantesCount > 0

  return {
    participantes,
    participantesCount,
    tieneParticipantes,
    loading: isLoading,
    fetching: isFetching,
    isError,
    error,
  }
}

export function useUpdateContractParticipant(idContrato: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateContractParticipants,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contrato', idContrato, 'participantes'] })
    },
  })
}
export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (payload: { contract: UpdateContract }) => patchUpdateContract(payload.contract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts", ] });
    },
  });
};
