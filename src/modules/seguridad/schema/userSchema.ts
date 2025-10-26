import {z} from "zod";

export const registerUserSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido1: z.string().min(2, "El apellido1 es obligatorio"),
  apellido2: z.string().min(2, "El apellido2 es obligatorio"),
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  idRolUsuario: z.number().min(1, "Selecciona un rol de usuario"),
});

export type CreateUserFormValues = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});