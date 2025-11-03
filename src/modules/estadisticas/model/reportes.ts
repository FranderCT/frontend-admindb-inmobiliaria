export interface vistaDashboard {
    TotalContratos: number;
    TotalPropiedades: number;
    TotalAgentes: number;
    TotalClientes: number;
    MontoTotalContratos: number;
    TotalComisiones: number;
}

export interface vistaContratosPorTipo {
    TipoContrato: string;
    TotalContratos: number;
    MontoTotal: number;
}

export interface vistaEstadisticasAgentes {
    Agente: string;
    TotalContratos: number;
    TotalComisiones: number;
    PromedioMontoContrato: number;
    ContratosFinalizados: number;
}

export interface vistaEstadisticasContratosMes {
    Anio: string;
    NombreMes: string;
    TotalContratos: number;
    MontoTotal: number;
}

export interface vistaEstadisticasHistorialClientes {
    Cliente: string;
    NombreRol: string;
    TipoContrato: string;
    Propiedad: string;
    AgenteEncargado: string;
    MontoTotalContrato: number;
    DuracionMeses: number;
    EstadoContrato: string;
    FechaInicio: string;

}

export interface vistaEstadisticasComisionesMes {
    Anio: string;
    NombreMes: string;
    TotalComisiones: number;
}

export interface vistaContratoDetalle {
    IdContratoDW: number;
    IdContrato_Original: number;
    Agente: string;
    TipoContrato: string;
    EstadoContrato: string;
    Ubicacion: string;
    MontoTotalContrato: number;
    MontoComision: number;
    DuracionMeses: number | null;
    ContratoFinalizado: boolean;
    IdTiempoInicio: number;
    FechaInicio: string;
    MesInicio: string;
    AnioInicio: number;
}

export interface vistaEstadisticasContratosEstado {
    EstadoContrato: string;
    TotalContratos: number;
}

export interface vistaEstadisticasTopPropiedades {
    Ubicacion: string;
    TotalContratos: number;
    TotalMonto: number;
}

export interface vistaEstadisticasTipoInmuble {
    TipoInmueble: string;
    TotalContratos: number;
}

export interface vistaEstadisticasPropiedadEstado {
    EstadoPropiedad: string;
    TotalPropiedades: number;
}

export interface vistaFacturacionCliente {
  Cliente: string
  NombreRol: string
  TotalContratos: number
  MontoTotal: number
  Comisiones: number
}