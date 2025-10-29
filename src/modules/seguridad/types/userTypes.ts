import { ColumnDef } from "@tanstack/react-table";
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
export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    total?: number;

    pageIndex?: number;
    pageSize?: number;
    setPageIndex?: (n: number) => void;
    setPageSize?: (n: number) => void;

    
    showPagination?: boolean;
    toolbar?: React.ReactNode;

    action?: (row: TData) => void;
    onRowClick?: (row: TData) => void;
    isRowRead?: (row: TData) => boolean;

    estado?: boolean;
    setEstado?: (v: boolean) => void;
}
