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
    access_token: string;
}

export interface User {
    idUsuario: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    idRolUsuario: number;
    estado: boolean;
}

export interface Role {
    idRolUsuario: number;
    nombre: string;
}