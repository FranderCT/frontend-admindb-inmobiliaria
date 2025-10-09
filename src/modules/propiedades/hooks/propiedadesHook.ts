import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createProperty, createPropertyStatus, createPropertyType, getPropertiesFiltered, getPropertyStatuses, getPropertyTypes } from "../services/propiedadesServices";
import { CreateProperty, CreatePropertyStatus, CreatePropertyType, PropertysPaginateParams,  } from "../models/propiedad";

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


export function useGetPropertyTypes(
) {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["propertyTypes"],
        queryFn: () => getPropertyTypes(),
    });

    return {
        propertyTypes: data,
        loadingPropertyTypes: isLoading,
        fetchingPropertyTypes: isFetching,
        errorPropertyTypes: error,
    };
}

export function useGetPropertyStatuses(
) {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["propertyStatuses"],
        queryFn: () => getPropertyStatuses(),
    });

    return {
        propertyStatuses: data,
        loadingPropertyStatuses: isLoading,
        fetchingPropertyStatuses: isFetching,
        errorPropertyStatuses: error,
    };
}


export function useGetPropertiesFiltered(params: PropertysPaginateParams) {
    return useQuery({
        queryKey: ["properties", "paginate", params],
        queryFn: () => getPropertiesFiltered(params),
        staleTime: 60_000,
    });
}
