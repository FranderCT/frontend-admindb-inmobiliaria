import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignContractParticipants, createContract, getContractRoleType, getContracts, getContractType } from "../services/contractServices";
import { ContractParticipantsPayload, CreateContract } from "../models/contract";


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
                queryKey: ["contracts"],
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
export function useGetContracts() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["contracts"],
        queryFn: () => getContracts(),
    });

    return {
        contracts: data,
        loadingContracts: isLoading,
        fetchingContracts: isFetching,
        errorContracts: error,
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

export function useGetAgent(identificacion: string, opts?: { enabled?: boolean }
) {
    const enabled = opts?.enabled ?? true;
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["client", identificacion],
        queryFn: () => getClient(identificacion),
        enabled: enabled && Boolean(identificacion)
    });

    return {
        agente: data,
        loadingAgente: isLoading,
        fetchingAgente: isFetching,
        errorAgente: error,
    };
}

export function useGetAgents() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["agents"],
        queryFn: () => getAgents(),
    });

    return {
        agentes: data,
        loadingAgentes: isLoading,
        fetchingAgentes: isFetching,
        errorAgentes: error,
    };
}




