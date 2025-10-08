import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCliente, deleteCliente, getCliente, getClientes, getClientesPaginate, updateCliente } from "../services/clientesServices";
import {  CreateClient, UpdateClient } from "../models/client";

// post

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



export function useGetCliente(
    identificacion: string
) {
    const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
        queryKey: ["cliente", identificacion],
        queryFn: () => getCliente(identificacion),
    });

    return {
        cliente: data,
        loadingCliente: isLoading,
        fetchingCliente: isFetching,
        errorCliente: error,
        isPlaceholderData,
    };
}



export function useGetHistorialCliente(
    identificacion: string
) {
    const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
        queryKey: ["cliente", identificacion],
        queryFn: () => getCliente(identificacion),
    });

    return {
        cliente: data,
        loadingCliente: isLoading,
        fetchingCliente: isFetching,
        errorCliente: error,
        isPlaceholderData,
    };
}

export function useGetClientesPaginate(params: {
    page?: number; limit?: number; sortCol?: string;
    sortDir?: "ASC" | "DESC"; q?: string; estado?: 0 | 1 | undefined;
}) {
    const normalized = {
        ...params,
        estado: typeof params.estado === "string"
            ? (Number(params.estado) as 0 | 1)
            : params.estado,
    };

    return useQuery({
        queryKey: ["clientes", "paginate", normalized],
        queryFn: () => getClientesPaginate(normalized),
        staleTime: 60_000,
    });
}

export const useDeleteCliente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (identificacion: string) => deleteCliente(identificacion),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clientes"],
            });
        },
    });
};

export const useUpdateCliente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            cliente,
        }: {
            cliente: UpdateClient;
        }) => updateCliente(cliente),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clientes"],
            });
        },
    });
};
