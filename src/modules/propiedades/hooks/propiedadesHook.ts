import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createProperty, createPropertyStatus, createPropertyType, deleteProperty, getPropertiesFiltered, getPropertyStatuses, getPropertyTypes, updateProperty } from "../services/propiedadesServices";
import { CreateProperty, CreatePropertyStatus, CreatePropertyType, PropertysPaginateParams, UpdateProperty,  } from "../models/propiedad";

export const useCreateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            property,
        }: {
            property: CreateProperty;
        }) => createProperty(property),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["properties"],
            });
        },
    });
};

export const useCreatePropertyStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            property,
        }: {
            property: CreatePropertyStatus;
        }) => createPropertyStatus(property),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["properties"],
            });
        },
    });
};

export const useCreatePropertyType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            property,
        }: {
            property: CreatePropertyType;
        }) => createPropertyType(property),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["properties"],
            });
        },
    });
};


export function useGetPropertyTypes(opts?: { enabled?: boolean }) {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["propertyTypes"],
        queryFn: () => getPropertyTypes(),
        enabled: opts?.enabled ?? true, 
    });

    return {
        propertyTypes: data,
        loadingPropertyTypes: isLoading,
        fetchingPropertyTypes: isFetching,
        errorPropertyTypes: error,
    };
}

export function useGetPropertyStatuses(
    opts?: { enabled?: boolean }
) {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["propertyStatuses"],
        queryFn: () => getPropertyStatuses(),
        enabled: opts?.enabled ?? true, 
    });

    return {
        propertyStatuses: data,
        loadingPropertyStatuses: isLoading,
        fetchingPropertyStatuses: isFetching,
        errorPropertyStatuses: error,
    };
}


export function useGetPropertiesFiltered(params: PropertysPaginateParams) {
  const normalized: PropertysPaginateParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 9,
    sortCol: params.sortCol ?? "idPropiedad",
    sortDir: params.sortDir ?? "ASC",
    q: params.q ?? "",
    estado:
      typeof params.estado === "string"
        ? (Number(params.estado) as 0 | 1)
        : params.estado,
    estadoPropiedadId:
      params.estadoPropiedadId != null ? Number(params.estadoPropiedadId) : undefined,
    tipoInmuebleId:
      params.tipoInmuebleId != null ? Number(params.tipoInmuebleId) : undefined,
  };

  return useQuery({
    queryKey: ["properties", "paginate", normalized],
    queryFn: () => getPropertiesFiltered(normalized),
    staleTime: 60_000,
  });
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "paginate"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { prop: UpdateProperty }) => updateProperty(payload.prop),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "paginate"] });
    },
  });
};
