import { useEffect, useMemo, useState } from "react";
import {
  createInvoice,
  getAllInvoices,
  getFilteredInvoices,
  markInvoiceAsPaidAndFetch,
  // NUEVO: consumir contratos disponibles para el Select del modal
  getAvailableContracts,
} from "../services/facturasServices";
import { CreateInvoiceForm, InvoiceFilters, InvoiceItem, InvoiceStatus } from "../types/facturasType";
import { useQueryClient } from "@tanstack/react-query";

const defaultFilters: InvoiceFilters = {
  estado: "Todos",
  idContrato: "",
  idCliente: "",
  fecha: "",
};

export function useInvoices() {
  const qc = useQueryClient();

  // listado
  const [data, setData] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [filters, setFilters] = useState<InvoiceFilters>(defaultFilters);

  // modal crear
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateInvoiceForm>({ idContrato: "", porcentajeIVA: 13 });

  // NUEVO: opciones del Select de contratos disponibles
  const [availableContracts, setAvailableContracts] = useState<
    Array<{ idContrato: number; tipoContrato: string }>
  >([]);

  // cargar contratos SOLO cuando se abre el modal
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const rows = await getAvailableContracts();
        setAvailableContracts(rows);
      } catch (e) {
        // mantenemos silencioso para no romper el flujo del modal
        console.error(e);
        setAvailableContracts([]);
      }
    })();
  }, [open]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getFilteredInvoices(filters);
      setData(list);
    } catch (err: any) {
      const msg =
        err?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "No se pudieron obtener las facturas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.estado, filters.idContrato, filters.idCliente, filters.fecha]);

  const setEstado = (estado: "Todos" | InvoiceStatus) => setFilters((s) => ({ ...s, estado }));
  const setContratoIdText = (v: string) => setFilters((s) => ({ ...s, idContrato: v }));
  const setClienteIdText = (v: string) => setFilters((s) => ({ ...s, idCliente: v }));
  const setFecha = (v: string) => setFilters((s) => ({ ...s, fecha: v }));

  const save = async () => {
    try {
      const idNum = Number(form.idContrato);
      if (!idNum || Number.isNaN(idNum)) throw new Error("Selecciona un contrato válido");
      const iva = Number(form.porcentajeIVA);
      if (Number.isNaN(iva)) throw new Error("IVA inválido");

      await createInvoice({
        idContrato: idNum,
        porcentajeIVA: iva,
      });

      // refrescar listado respetando filtros actuales
      await fetchList();

      // cerrar y resetear
      setOpen(false);
      setForm({ idContrato: "", porcentajeIVA: 13 });
      // invalidate react-query si lo usas en otros lugares
      qc.invalidateQueries();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "No se pudo crear la factura";
      setError(msg);
    }
  };

  const pagar = async (id: number) => {
    try {
      const list = await markInvoiceAsPaidAndFetch(id, filters);
      setData(list);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "No se pudo marcar como pagada";
      setError(msg);
    }
  };

  return {
    data,
    loading,
    error,

    // filtros
    setEstado,
    setContratoIdText,
    setClienteIdText,
    setFecha,

    // modal crear
    open,
    setOpen,
    form,
    setForm,

    // acciones
    save,
    pagar,

    // NUEVO: opciones para el <Select> del modal
    availableContracts,
  };
}
