import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, Login, LoginResponse, UsersMeta, UsersResponse } from "../models/usuario";
import { createUser, deactivateUser, getRoles, getUsers, loginUser } from "../services/usuariosServices";
import altosDelValleAPI from "@/api/altosdelvalle";

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            user,
        }: {
            user: CreateUser;
        }) => createUser(user),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user }: { user: Login }) => loginUser(user),

    onSuccess: (data: LoginResponse) => {
      localStorage.setItem("token", data.token);

      altosDelValleAPI.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};


export function useGetRoles() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["roles"],
        queryFn: () => getRoles(),
    });

    return {
        roles: data,
        loadingRoles: isLoading,
        fetchingRoles: isFetching,
        errorRoles: error,
    };
}

const EMPTY_META: UsersMeta = {
  total: 0, page: 1, limit: 10, pageCount: 1, hasNextPage: false, hasPrevPage: false,
};

export const useGetUsers = (page: number, limit: number, estado: boolean) => {
  const { data, isLoading, error, isFetching, isRefetching } = useQuery<UsersResponse>({
    queryKey: ["users", page, limit, estado],
    queryFn: () => getUsers(page, limit, estado),
    // evita parpadeos y estados undefined al paginar
    placeholderData: (prev) => prev ?? { data: [], meta: EMPTY_META },
  });

  const safeData = data ?? { data: [], meta: EMPTY_META };

  return {
    usersResponse: safeData,
    users: safeData.data,
    meta: safeData.meta,
    loadingUsers: isLoading,
    fetchingUsers: isFetching || isRefetching,
    errorUsers: error,
  };
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idUsuario: number) => deactivateUser(idUsuario),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};