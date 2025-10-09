import { CreateProperty, CreatePropertyStatus, CreatePropertyType, Propiedad } from "../models/propiedad"

export type PropiedadCardProps = {
    property: Propiedad;
    estadosPropiedad?: { label: string; value: number }[];
    tiposInmueble?: { label: string; value: number }[];
};


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

export type UpdateProperty = {
  idPropiedad: number;
  ubicacion: string;
  precio: number;
  estadoPropiedadId: number;
  tipoInmuebleId: number;
};

export type EditPropiedadDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  from?: string;
  showCloseButton?: boolean;
  property: {
    idPropiedad: number;
    ubicacion: string;
    precio: number;
    estadoPropiedad: { idEstadoPropiedad: number; nombre: string };
    tipoInmueble: { idTipoInmueble: number; nombre: string };
  };
  estadosPropiedad?: { label: string; value: number }[];
  tiposInmueble?: { label: string; value: number }[];
};
