import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient, deleteClient,  getClient,  getClients,  getClientsFiltered,  updateClient } from "../services/clientesServices";
import {  CreateClient, UpdateClient } from "../models/client";

// post

export const useCreateClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            client,
        }: {
            client: CreateClient;
        }) => createClient(client),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clients"],
            });
        },
    });
};



export function useGetClients(
) {
    const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
        queryKey: ["clients"],
        queryFn: () => getClients(),
    });

    return {
        clientes: data,
        loadingClientes: isLoading,
        fetchingClientes: isFetching,
        errorClientes: error,
        isPlaceholderData,
    };
}



export function useGetClient(
    identificacion: string, opts?: { enabled?: boolean }
) {
    const enabled = opts?.enabled ?? true;
    const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
        queryKey: ["client", identificacion],
        queryFn: () => getClient(identificacion),
        enabled: enabled && Boolean(identificacion)
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
        queryKey: ["client", identificacion],
        queryFn: () => getClient(identificacion),
    });

    return {
        cliente: data,
        loadingCliente: isLoading,
        fetchingCliente: isFetching,
        errorCliente: error,
        isPlaceholderData,
    };
}

export function useGetClientsFiltered(params: {
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
        queryKey: ["clients", "paginate", normalized],
        queryFn: () => getClientsFiltered(normalized),
        staleTime: 60_000,
    });
}

export const useDeleteClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (identificacion: string) => deleteClient(identificacion),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clients"],
            });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            client,
        }: {
            client: UpdateClient;
        }) => updateClient(client),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clients"],
            });
        },
    });
};
