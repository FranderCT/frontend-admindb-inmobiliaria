import altosDelValleAPI from "@/api/altosdelvalle";
import { CreatePropertyStatus, CreatePropertyType, CreateProperty, PropertyType, PropertyStatus, PropertysPaginateParams, Propiedad, UpdateProperty } from "../models/propiedad";

export const createProperty = async (property: CreateProperty): Promise<CreateProperty> => {
  const response = await altosDelValleAPI.post<CreateProperty>(
    `/propiedad`,
    property
  );
  return response.data;
};

export const createPropertyType = async (type: CreatePropertyType): Promise<CreatePropertyType> => {
  const response = await altosDelValleAPI.post<CreatePropertyType>(
    `/tipo-inmueble`,
    type
  );
  return response.data;
};

export const createPropertyStatus = async (status: CreatePropertyStatus): Promise<CreatePropertyStatus> => {
  const response = await altosDelValleAPI.post<CreatePropertyStatus>(
    `/estado-propiedad`,
    status
  );
  return response.data;
};



export const getPropertyStatuses = async (): Promise<PropertyStatus[]> => {
  const response = await altosDelValleAPI.get<PropertyStatus[]>(`estado-propiedad`);
  return response.data;
};


export const getPropertyTypes = async (): Promise<PropertyType[]> => {
  const response = await altosDelValleAPI.get<PropertyType[]>(`tipo-inmueble`);
  return response.data;
};

export const getPropertiesFiltered = async (params: PropertysPaginateParams) => {
  const { data } = await altosDelValleAPI.get("/propiedad/paginate", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 9,
      sortCol: params.sortCol ?? "idPropiedad",
      sortDir: params.sortDir ?? "ASC",
      ...(params.q ? { q: params.q } : {}),
      ...(typeof params.estado === "number" ? { estado: params.estado } : {}),
      ...(typeof params.estadoPropiedadId === "number"
        ? { estadoPropiedadId: params.estadoPropiedadId }
        : {}),
      ...(typeof params.tipoInmuebleId === "number"
        ? { tipoInmuebleId: params.tipoInmuebleId }
        : {}),
    },
  });
  return data as {
    data: Propiedad[];
    meta: { total: number; page: number; limit: number; pageCount: number; hasNextPage: boolean; hasPrevPage: boolean };
  };
};

export const deleteProperty = async (idPropiedad: number): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.delete<{ ok: boolean }>(`propiedad/${idPropiedad}`);
    return response.data;
}

export const updateProperty = async (data: UpdateProperty): Promise<{ ok: boolean }> => {
  const response = await altosDelValleAPI.patch<{ ok: boolean }>(`propiedad/${data.idPropiedad}`, data);
  return response.data;
}