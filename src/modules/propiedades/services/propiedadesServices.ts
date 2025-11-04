import altosDelValleAPI from "@/api/altosdelvalle";
import { CreatePropertyStatus, CreatePropertyType, PropertyType, PropertyStatus, PropertysPaginateParams, UpdateProperty, Propiedad, CreatePropertyPayload, UpdatePropertyPayload, UpdatePropertyJSON } from "../models/propiedad";


// post

export const createProperty = async ({ property, file }: CreatePropertyPayload) => {
  if (!(file instanceof File)) {
    throw new Error("La imagen es obligatoria y debe ser un archivo válido.");
  }

  const fd = new FormData();
  // campos que tu DTO espera
  fd.append("ubicacion", property.ubicacion);
  fd.append("precio", String(property.precio));
  fd.append("idEstado", String(property.idEstado));
  fd.append("idTipoInmueble", String(property.idTipoInmueble));
  fd.append("identificacion", String(property.identificacion));
  fd.append("cantBannios", String(property.cantBannios));
  fd.append("cantHabitaciones", String(property.cantHabitaciones));
  fd.append("areaM2", String(property.areaM2));
  fd.append("amueblado", String(property.amueblado === true)); 

  fd.append("imagen", file, file.name);

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

export async function updateProperty(
  input: UpdatePropertyPayload | UpdatePropertyJSON
): Promise<{ ok: boolean }> {
  // Normaliza a { prop, file }
  let prop: UpdatePropertyJSON | undefined;
  let file: File | undefined;

  if (hasProp(input)) {
    prop = input.prop;
    file = input.file;
  } else if (hasIdPropiedad(input)) {
    prop = input;
  } else {
    throw new Error(
      "updateProperty: input inválido. Esperaba { prop: { idPropiedad, ... }, file? } o { idPropiedad, ... }."
    );
  }

  if (!prop || typeof prop.idPropiedad !== "number") {
    throw new Error(
      "updateProperty: falta idPropiedad en el objeto a actualizar."
    );
  }

  const { idPropiedad, ...rest } = prop;

  // Si hay archivo => multipart con sólo los campos definidos
  if (file instanceof File) {
    const fd = new FormData();
    Object.entries(rest).forEach(([k, v]) => appendIfDefined(fd, k, v));
    fd.append("imagen", file, file.name);

    const res = await altosDelValleAPI.patch<{ ok: boolean }>(
      `/propiedad/${idPropiedad}`,
      fd,
      {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(d) => d],
      }
    );
    return res.data;
  }

  // Sin archivo => JSON con los campos definidos
  const res = await altosDelValleAPI.patch<{ ok: boolean }>(
    `/propiedad/${idPropiedad}`,
    rest
  );
  return res.data;
}

const hasProp = (x: any): x is UpdatePropertyPayload =>
  x && typeof x === "object" && "prop" in x;

const hasIdPropiedad = (x: any): x is UpdatePropertyJSON =>
  x && typeof x === "object" && "idPropiedad" in x;

// ----- Helper
const appendIfDefined = (fd: FormData, key: string, val: unknown) => {
  if (val === undefined || val === null) return;
  if (typeof val === "boolean") fd.append(key, val ? "true" : "false");
  else fd.append(key, String(val));
};