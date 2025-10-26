import altosDelValleAPI from "@/api/altosdelvalle";
import { CreateUser, Login, LoginResponse, Role, User } from "../models/usuario";

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

export const getUsers = async (): Promise<User[]> => {
  const response = await altosDelValleAPI.get<User[]>(
    `/usuarios`
  );
  return response.data;
}