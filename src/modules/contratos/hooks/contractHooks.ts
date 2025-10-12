import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContract, getContracts } from "../services/contractServices";
import { CreateContract } from "../models/contract";


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
