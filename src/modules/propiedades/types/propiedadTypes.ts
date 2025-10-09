import { CreateProperty, CreatePropertyStatus, CreatePropertyType, Propiedad } from "../models/propiedad"

export type PropiedadCardProps = { 
    property: Propiedad
}

export const initialValuesPropertyStatus: CreatePropertyStatus = {
  nombre: "",
};

export const initialValuesPropertyType: CreatePropertyType = {
    nombre: "",
};

export const initialValuesProperty: CreateProperty = {
    ubicacion: "",
    precio: "₡0",
    idEstado: 0,
    identificacion: 0,
    idTipoInmueble: 0,
};

type Option = { label: string; value: number };

export type PropiedadesFilteredProps = {
  estadosPropiedad?: Option[]; // ej: [{label:'Disponible', value:1}, ...]
  tiposInmueble?: Option[];    // ej: [{label:'Casa', value:1}, ...]
};