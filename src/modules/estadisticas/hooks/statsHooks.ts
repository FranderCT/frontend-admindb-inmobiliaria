import { useQuery } from "@tanstack/react-query";
import { getReportesContratosTipo, getReportesDashboardData, getReportesEstadisticasAgentes, getReportesContratosMes, getReportesHistorialClientes, getReportesContratoResumen, getReportesContratosEstado, getReportesTopPropiedades, getReportesPropiedadesEstado, getReportesPropiedadesInmueble, getReportesFacturacionClientes } from "../services/statsServices";
import { vistaFacturacionCliente } from "../model/reportes";

export function useGetDashboardReport() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasDashboard"],
        queryFn: () => getReportesDashboardData(),
    });

    return {
        dashboardReport: data,
        loadingDashboardReport: isLoading,
        fetchingDashboardReport: isFetching,
        errorDashboardReport: error,
    };
}
export function useGetContratosTipo() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasContratosTipo"],
        queryFn: () => getReportesContratosTipo(),
    });

    return {
        contratosTipo: data,
        loadingContratosTipo: isLoading,
        fetchingContratosTipo: isFetching,
        errorContratosTipo: error,
    };
}
export function useGetEstadisticasAgentes() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasAgentes"],
        queryFn: () => getReportesEstadisticasAgentes(),
    });

    return {
        estadisticasAgentes: data,
        loadingEstadisticasAgentes: isLoading,
        fetchingEstadisticasAgentes: isFetching,
        errorEstadisticasAgentes: error,
    };
}
export function useGetContratosMes() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasContratosMes"],
        queryFn: () => getReportesContratosMes(),
    });

    return {
        estadisticasContratosMes: data,
        loadingEstadisticasContratosMes: isLoading,
        fetchingEstadisticasContratosMes: isFetching,
        errorEstadisticasContratosMes: error,
    };
}
export function useGetHistorialClientes() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasHistorialClientes"],
        queryFn: () => getReportesHistorialClientes(),
    });

    return {
        estadisticasHistorialClientes: data,
        loadingEstadisticasHistorialClientes: isLoading,
        fetchingEstadisticasHistorialClientes: isFetching,
        errorEstadisticasHistorialClientes: error,
    };
}

export function useGetContratoResumen() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasContratoResumen"],
        queryFn: () => getReportesContratoResumen(),
    });

    return {
        estadisticasContratoResumen: data,
        loadingEstadisticasContratoResumen: isLoading,
        fetchingEstadisticasContratoResumen: isFetching,
        errorEstadisticasContratoResumen: error,
    };
}
export function useGetContratoEstado() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasContratoEstado"],
        queryFn: () => getReportesContratosEstado(),
    });

    return {
        estadisticasContratoEstado: data,
        loadingEstadisticasContratoEstado: isLoading,
        fetchingEstadisticasContratoEstado: isFetching,
        errorEstadisticasContratoEstado: error,
    };
}
export function useGetPropiedadesTop() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasPropiedadesTop"],
        queryFn: () => getReportesTopPropiedades(),
    });

    return {
        propiedadesTop: data,
        loadingPropiedadesTop: isLoading,
        fetchingPropiedadesTop: isFetching,
        errorPropiedadesTop: error,
    };
}

export function useGetPropiedadesEstado() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasPropiedadesEstado"],
        queryFn: () => getReportesPropiedadesEstado(),
    });

    return {
        propiedadesEstado: data,
        loadingPropiedadesEstado: isLoading,
        fetchingPropiedadesEstado: isFetching,
        errorPropiedadesEstado: error,
    };
}

export function useGetPropiedadesTipoInmueble() {
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["estadisticasPropiedadesTipoInmueble"],
        queryFn: () => getReportesPropiedadesInmueble(),
    });

    return {
        propiedadesTipoInmueble: data,
        loadingPropiedadesTipoInmueble: isLoading,
        fetchingPropiedadesTipoInmueble: isFetching,
        errorPropiedadesTipoInmueble: error,
    };
}
export const useGetFacturacionClientes = () => {
  const { data, isLoading, isFetching, error } = useQuery<vistaFacturacionCliente[]>({
    queryKey: ['facturacionClientes'],
      queryFn: getReportesFacturacionClientes,
  })
  return {
    facturacionClientes: data ?? [],
    loadingFacturacionClientes: isLoading,
    fetchingFacturacionClientes: isFetching,
    errorFacturacionClientes: error,
  }
}