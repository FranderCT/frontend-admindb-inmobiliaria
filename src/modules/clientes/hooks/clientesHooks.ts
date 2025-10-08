import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCliente, deleteCliente, getCliente, getClientes, getClientesPaginate, updateCliente } from "../services/clientesServices";
import {  CreateClient, UpdateClient } from "../models/client";
import { ClientesPaginateParams, ClientesPaginateResponse } from "../types/clientTypes";

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

export function useGetClientesPaginate(params: ClientesPaginateParams) {
  const qc = useQueryClient();

  const query = useQuery<ClientesPaginateResponse>({
    queryKey: ["clientes", "paginate", params],
    queryFn: () => getClientesPaginate(params),
    staleTime: 60_000,
  });

  const prefetchNext = () => {
    const nextPage = (query.data?.meta.page ?? 1) + 1;
    const pageCount = query.data?.meta.pageCount ?? 1;
    if (nextPage <= pageCount) {
      const nextParams = { ...params, page: nextPage };
      qc.prefetchQuery({
        queryKey: ["clientes", "paginate", nextParams],
        queryFn: () => getClientesPaginate(nextParams),
        staleTime: 60_000,
      });
    }
  };

  return { ...query, prefetchNext };
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
