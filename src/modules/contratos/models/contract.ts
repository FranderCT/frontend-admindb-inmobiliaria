export interface CreateContract {
    fechaInicio: string;
    fechaFin: string;
    fechaFirma: string;
    fechaPago: string;
    idTipoContrato: number;
    idPropiedad: number;
    idAgente: number;
    condiciones: string[]
}

export interface Contract{
    idContrato: number,
    fechaInicio: string,
    fechaFin: string,
    fechaFirma: string,
    fechaPago: string,
    TipoContrato: string,
    Propiedad: string,
    NombreAgente: string,
    ApellidoAgente: string,
    condiciones: [
      {
        idCondicion: number,
        textoCondicion: string
      }
    ]
}