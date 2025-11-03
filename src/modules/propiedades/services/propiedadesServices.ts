import altosDelValleAPI from "@/api/altosdelvalle";
import { CreatePropertyStatus, CreatePropertyType, CreateProperty, PropertyType, PropertyStatus, PropertysPaginateParams, UpdateProperty, Propiedad, CreatePropertyPayload } from "../models/propiedad";


// post
export const createProperty = async ({
  property,
  file,
}: CreatePropertyPayload): Promise<CreateProperty> => {
  const fd = new FormData();

  fd.append("ubicacion", property.ubicacion);
  fd.append("precio", String(Number(property.precio || 0))); 
  fd.append("idEstado", String(property.idEstado));
  fd.append("idTipoInmueble", String(property.idTipoInmueble));
  fd.append("identificacion", String(property.identificacion));

  if (file) fd.append("imagen", file);

  const res = await altosDelValleAPI.post(`/propiedad`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: [(d) => d], 
  });

  return res.data;
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

// get

export const getPropertyStatuses = async (): Promise<PropertyStatus[]> => {
  const response = await altosDelValleAPI.get<PropertyStatus[]>(`estado-propiedad`);
  return response.data;
};

export const getProperty = async (idPropiedad: number): Promise<Propiedad> => {
  const response = await altosDelValleAPI.get<Propiedad>(`propiedad/${idPropiedad}`);
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

//delete
export const deleteProperty = async (idPropiedad: number): Promise<{ ok: boolean }> => {
    const response = await altosDelValleAPI.delete<{ ok: boolean }>(`propiedad/${idPropiedad}`);
    return response.data;
}


// patch
export const updateProperty = async (data: UpdateProperty): Promise<{ ok: boolean }> => {
  const response = await altosDelValleAPI.patch<{ ok: boolean }>(`propiedad/${data.idPropiedad}`, data);
  return response.data;
}