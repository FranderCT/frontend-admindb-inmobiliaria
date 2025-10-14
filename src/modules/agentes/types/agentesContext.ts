import { JSX } from "react";

export type SortDir = "ASC" | "DESC";
export type Estado = "0" | "1";

export type AgentesFilters = {
  page: number;
  limit: number;
  sortCol: string;
  sortDir: SortDir;
  q: string;
  estado: Estado;
};
export type AgentesProviderType = {
    children: JSX.Element
}


export const defaultFilters: AgentesFilters = {
    page: 1,
    limit: 9,
    sortCol: "identificacion",
    sortDir: "ASC",
    q: "",
    estado: "1",
};