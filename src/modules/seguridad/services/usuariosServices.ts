import altosDelValleAPI from "@/api/altosdelvalle";
import { CreateUser, Login, LoginResponse, Role, UsersResponse } from "../models/usuario";

export const createUser = async (user: CreateUser): Promise<CreateUser> => {
  const response = await altosDelValleAPI.post<CreateUser>(
    `/auth/register`,
    user
  );
  return response.data;
};

export const loginUser = async (user: Login): Promise<LoginResponse> => {
  const response = await altosDelValleAPI.post<LoginResponse>(
    `/auth/login`,
    user
  );
  return response.data;
};

export const getRoles = async (): Promise<Role[]> => {
  const response = await altosDelValleAPI.get<Role[]>(
    `/rol-usuarios`
  );
  return response.data;
}

export const getUsers = async (
  page: number,
  limit: number,
  estado: boolean
): Promise<UsersResponse> => {
  const { data } = await altosDelValleAPI.get<UsersResponse>(
    `/usuario/all?page=${page}&limit=${limit}&estado=${estado}`
  );
  return data;
};


export const deactivateUser = async (idUsuario: number): Promise<void> => {
  await altosDelValleAPI.patch(`/usuario/desactive/${idUsuario}`);
}