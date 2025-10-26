import { User } from "../models/usuario";

export const initialValuesRegister = {   
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    password: "",
    idRolUsuario: 0,
};
export const initialValuesLogin = {
    email: "",
    password: "",
};

export type CardUserProps = {
    user: User
}