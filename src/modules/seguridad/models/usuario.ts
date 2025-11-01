export interface CreateUser {
    nombre: string
    apellido1: string;
    apellido2: string;
    email: string;
    password: string;
    idRolUsuario: number;
}

export interface Login {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}
export interface rolUsuario{
    idRolUsuario: number;
    nombre: string;
}
export interface User {
    idUsuario: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    rolUsuario: rolUsuario;
    estado: boolean;
}
export type UsersMeta = {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type UsersResponse = {
data: User[];
meta: UsersMeta;
};
export interface Role {
    idRolUsuario: number;
    nombre: string;
}

