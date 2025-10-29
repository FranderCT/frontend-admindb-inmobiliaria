import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, Login, LoginResponse } from "../models/usuario";
import { createUser, getRoles, getUsers, loginUser } from "../services/usuariosServices";
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
      localStorage.setItem("token", data.access_token);

      altosDelValleAPI.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

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

export const useGetUsers = () => {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
    });

    return {
        users: data,
        loadingUsers: isLoading,
        fetchingUsers: isFetching,
        errorUsers: error,
    };
}