import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryResult,
} from "@tanstack/react-query";
import { Agent, CreateAgent, UpdateAgent } from "../models/agent";
import {
  createAgent,
  deleteAgent,
  getAgent,
  getAgents,
  updateAgent,
} from "../services/agentesServices";


function useQueryAgent() {
  
  return useQueryClient();
}

export const useCreateAgent = () => {
  const queryClient = useQueryAgent();
  return useMutation({
    mutationFn: ({ agent }: { agent: CreateAgent }) => createAgent(agent),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryAgent();
  return useMutation({
    mutationFn: (identificacion: string) => deleteAgent(identificacion),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryAgent();
  return useMutation({
    mutationFn: ({ agent }: { agent: UpdateAgent }) => {
      const anyAgent = agent as UpdateAgent & { identificacion: string | number };
      const { identificacion, ...dto } = anyAgent;

      if (identificacion === undefined || identificacion === null) {
        throw new Error("Falta 'identificacion' para actualizar el agente.");
      }
      return updateAgent({
        identificacion: String(identificacion),
        ...dto,
      } as UpdateAgent & { identificacion: string });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });
};

export function useGetAgents() {
  const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
    queryKey: ["agents"],
    queryFn: () => getAgents(),
  });

  return {
    agente: data,
    loadingAgente: isLoading,
    fetchingAgente: isFetching,
    errorAgente: error,
    isPlaceholderData,
  };
}

export function useGetAgent(
  identificacion: string,
  opts?: { enabled?: boolean }
) {
  const enabled = opts?.enabled ?? true;
  const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
    queryKey: ["agent", identificacion],
    queryFn: () => getAgent(identificacion),
    enabled: enabled && Boolean(identificacion),
  });

  return {
    agente: data,
    loadingAgente: isLoading,
    fetchingAgente: isFetching,
    errorAgente: error,
    isPlaceholderData,
  };
}

export function useGetHistorialAgente(identificacion: string) {
  const { data, isLoading, error, isPlaceholderData, isFetching } = useQuery({
    queryKey: ["agent", identificacion],
    queryFn: () => getAgent(identificacion),
  });

  return {
    agente: data,
    loadingAgente: isLoading,
    fetchingAgente: isFetching,
    errorAgente: error,
    isPlaceholderData,
  };
}

type FiltersInput = {
  page?: number;
  limit?: number;
  sortCol?: string;
  sortDir?: "ASC" | "DESC";
  q?: string;
  estado?: 0 | 1 | undefined | string; 
};

type AgentsPageResponse = {
  data: Agent[];
  meta: { page: number; pageCount: number; total: number };
};

export function useGetAgentsFiltered(
  params: FiltersInput
): UseQueryResult<AgentsPageResponse, Error> & {
  prefetchNext: () => Promise<unknown>;
} {
  const queryClient = useQueryAgent();

  const normalized: FiltersInput = {
    ...params,
    estado:
      typeof params?.estado === "string"
        ? (Number(params.estado) as 0 | 1)
        : params?.estado,
  };

  const fetchNormalized = async (): Promise<AgentsPageResponse> => {
    const res: any = await getAgents(normalized);
    if (Array.isArray(res)) {
      const page = normalized.page ?? 1;
      return {
        data: res as Agent[],
        meta: {
          page,
          pageCount: 1,
          total: res.length,
        },
      };
    }
    return res as AgentsPageResponse;
  };

  const query = useQuery<AgentsPageResponse, Error>({
    queryKey: ["agents", normalized],
    queryFn: fetchNormalized,
    placeholderData: keepPreviousData,
  });

  const prefetchNext = () => {
    const nextPage = (normalized.page ?? 1) + 1;
    const nextFilters = { ...normalized, page: nextPage };

    return queryClient.prefetchQuery({
      queryKey: ["agents", nextFilters],
      queryFn: async () => {
        const res: any = await getAgents(nextFilters);
        if (Array.isArray(res)) {
          return {
            data: res as Agent[],
            meta: { page: nextPage, pageCount: 1, total: res.length },
          } as AgentsPageResponse;
        }
        return res as AgentsPageResponse;
      },
    });
  };

  return Object.assign(query, { prefetchNext });
}
