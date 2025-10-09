import altosDelValleAPI from "@/api/altosdelvalle";
import { CreatePropertyStatus, CreatePropertyType, CreateProperty, PropertyType, PropertyStatus, PropertysPaginateParams, UpdateProperty } from "../models/propiedad";

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

export const getPropertiesFiltered = async (p: PropertysPaginateParams) => {
  const params: Record<string, unknown> = {
    page: p.page ?? 1,
    limit: p.limit ?? 9,
    sortCol: p.sortCol ?? "idPropiedad",
    sortDir: p.sortDir ?? "ASC",
  };
  if (p.q) params.q = p.q;
  if (typeof p.estado === "number") params.estado = p.estado;

  if (typeof p.estadoPropiedadId === "number")
    params.idEstadoPropiedad = p.estadoPropiedadId;

  if (typeof p.tipoInmuebleId === "number")
    params.idTipoInmueble = p.tipoInmuebleId;

  const { data } = await altosDelValleAPI.get("/propiedad/paginate", { params });
  return data;
};

export const deleteProperty = async (idPropiedad: number): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.delete<{ ok: boolean }>(`propiedad/${idPropiedad}`);
    return response.data;
}

export const updateProperty = async (data: UpdateProperty): Promise<{ ok: boolean }> => {
  const response = await altosDelValleAPI.patch<{ ok: boolean }>(`propiedad/${data.idPropiedad}`, data);
  return response.data;
}