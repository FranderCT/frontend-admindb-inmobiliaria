
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// post

import { createCliente, getClientes } from "../services/clientesServices";
import {  CreateClient } from "../models/client";

export const useCreateCliente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            cliente,
        }: {
            cliente: CreateClient;
        }) => createCliente(cliente),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clientes"],
            });
        },
    });
};



export function useGetClientes(
) {
    const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
        queryKey: ["clientes"],
        queryFn: () => getClientes(),
    });

    return {
        clientes: data,
        loadingClientes: isLoading,
        fetchingClientes: isFetching,
        errorClientes: error,
        isPlaceholderData,
    };
}

