import altosDelValleAPI from "@/api/altosdelvalle";
import { CreatePropertyStatus, CreatePropertyType, PropertyType, PropertyStatus, PropertysPaginateParams, UpdateProperty, Propiedad, CreatePropertyPayload } from "../models/propiedad";


// post

const appendIf = (fd: FormData, k: string, v: unknown) => {
  if (v !== undefined && v !== null) fd.append(k, String(v));
};

export const createProperty = async ({ property, file }: CreatePropertyPayload) => {
  if (!file) throw new Error("La imagen es obligatoria");

  const fd = new FormData();
  appendIf(fd, "ubicacion", property.ubicacion);
  appendIf(fd, "precio", property.precio);
  appendIf(fd, "idEstado", property.idEstado);
  appendIf(fd, "idTipoInmueble", property.idTipoInmueble);
  appendIf(fd, "identificacion", property.identificacion);
  appendIf(fd, "amueblado", property.amueblado ? 1 : 0);
  appendIf(fd, "cantHabitaciones", property.cantHabitaciones);
  appendIf(fd, "cantBannios", property.cantBannios);
  appendIf(fd, "areaM2", property.areaM2);

  fd.append("imagen", file);

  const { data } = await altosDelValleAPI.post(`/propiedad`, fd);
  return data;
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