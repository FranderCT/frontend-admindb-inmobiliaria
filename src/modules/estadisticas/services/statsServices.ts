import altosDelValleAPI from "@/api/altosdelvalle";
import { vistaContratoDetalle, vistaContratosPorTipo, vistaDashboard, vistaEstadisticasAgentes, vistaEstadisticasComisionesMes, vistaEstadisticasContratosEstado, vistaEstadisticasContratosMes, vistaEstadisticasHistorialClientes, vistaEstadisticasPropiedadEstado, vistaEstadisticasTipoInmuble, vistaEstadisticasTopPropiedades, vistaFacturacionCliente } from "../model/reportes";

export const getReportesContratoResumen = async (): Promise<vistaContratoDetalle[]> => {
    const response = await altosDelValleAPI.get<vistaContratoDetalle[]>(`datamart/vista/contratos`);
    return response.data;
};

export const getReportesHistorialClientes = async (): Promise<vistaEstadisticasHistorialClientes[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasHistorialClientes[]>(`datamart/vista/historial-clientes`);
    return response.data;
};

export const getReportesEstadisticasAgentes = async (): Promise<vistaEstadisticasAgentes[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasAgentes[]>(`datamart/vista/estadisticas-agentes`);
    return response.data;
};

export const getReportesDashboardData = async (): Promise<vistaDashboard[]> => {
    const response = await altosDelValleAPI.get<vistaDashboard[]>(`datamart/vista/dashboard`);
  return response.data;
};

export const getReportesContratosTipo = async (): Promise<vistaContratosPorTipo[]> => {
    const response = await altosDelValleAPI.get<vistaContratosPorTipo[]>(`datamart/vista/contratos-tipo`);
  return response.data;
};

export const getReportesContratosMes = async (): Promise<vistaEstadisticasContratosMes[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasContratosMes[]>(`datamart/vista/contratos-mes`);
    return response.data;
};

export const getReportesComisionesMes = async (): Promise<vistaEstadisticasComisionesMes[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasComisionesMes[]>(`datamart/vista/comisiones-mes`);
    return response.data;
};
export const getReportesTopPropiedades = async (): Promise<vistaEstadisticasTopPropiedades[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasTopPropiedades[]>(`datamart/vista/top-propiedades`);
    return response.data;
};
export const getReportesContratosEstado = async (): Promise<vistaEstadisticasContratosEstado[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasContratosEstado[]>(`datamart/vista/contratos-estado`);
    return response.data;
};
export const getReportesPropiedadesInmueble = async (): Promise<vistaEstadisticasTipoInmuble[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasTipoInmuble[]>(`datamart/vista/distribucion-inmueble`);
    return response.data;
};
export const getReportesPropiedadesEstado = async (): Promise<vistaEstadisticasPropiedadEstado[]> => {
    const response = await altosDelValleAPI.get<vistaEstadisticasPropiedadEstado[]>(`datamart/vista/estado-propiedades`);
    return response.data;
}; 
export const getReportesFacturacionClientes = async (): Promise<vistaFacturacionCliente[]> => {
    const { data } = await altosDelValleAPI.get<vistaFacturacionCliente[]>(
    'datamart/vista/facturacion-clientes'
  )
  return data
}