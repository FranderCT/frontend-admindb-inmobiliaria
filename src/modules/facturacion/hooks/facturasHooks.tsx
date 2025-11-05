import { useEffect, useMemo, useState } from "react";
import {
  createInvoice,
  markInvoiceAsPaidAndFetch,
  getAvailableContracts,
  getInvoicesPaginated,
} from "../services/facturasServices";

import {
  CreateInvoiceForm,
  InvoiceFilters,
  InvoiceItem,
  InvoiceStatus,
  PaginationParams,   
} from "../types/facturasType";

import { useQueryClient } from "@tanstack/react-query";

/** Filtros por defecto */
const defaultFilters: InvoiceFilters = {
  estado: "Todos",
  idContrato: "",
  idCliente: "",
  fecha: "",
};

export function useInvoices() {
  const qc = useQueryClient();

  // -----------------------------
  // listado y estado general
  // -----------------------------
  const [data, setData] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // filtros
  // -----------------------------
  const [filters, setFilters] = useState<InvoiceFilters>(defaultFilters);

  const setEstado = (val: "Todos" | InvoiceStatus) =>
    setFilters((f) => ({ ...f, estado: val }));

  const setContratoIdText = (val: string) =>
    setFilters((f) => ({ ...f, idContrato: val }));

  const setClienteIdText = (val: string) =>
    setFilters((f) => ({ ...f, idCliente: val }));

  const setFecha = (val: string) =>
    setFilters((f) => ({ ...f, fecha: val }));

  // -----------------------------
  // paginación + sort (sin fechaEmision)
  // -----------------------------
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);
  const [total, setTotal] = useState<number>(0);

  // columnas permitidas: 'idFactura' | 'montoPagado' | 'estadoPago'
  const [sortCol, setSortCol] = useState<PaginationParams["sortCol"]>("idFactura");
  const [sortDir, setSortDir] = useState<PaginationParams["sortDir"]>("ASC");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / Math.max(1, limit || 1))),
    [total, limit]
  );

  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const changeLimit = (n: number) => {
    const safe = Math.max(1, Math.min(100, Number(n) || 1));
    setLimit(safe);
    setPage(1); 
  };

  // -----------------------------
  // modal crear factura
  // -----------------------------
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<CreateInvoiceForm>({
    idContrato: "",
    porcentajeIVA: 13,
  });

  // contratos disponibles para el <Select> del modal
  const [availableContracts, setAvailableContracts] = useState<
    Array<{ idContrato: number; tipoContrato: string }>
  >([]);

  // -----------------------------
  // fetch de la lista (paginado)
  // -----------------------------
  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageReq: PaginationParams = {
        page,
        limit,
        sortCol,
        sortDir,
      };
      const res = await getInvoicesPaginated(filters, pageReq);
      setData(res.items);
      setTotal(Number(res.total) || 0);
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

  // cargar contratos del modal (una vez)
  const fetchAvailableContracts = async () => {
    try {
      const rows = await getAvailableContracts();
      setAvailableContracts(rows);
    } catch {
      // silencioso: el modal puede manejar vacío
      setAvailableContracts([]);
    }
  };

  // disparadores
  useEffect(() => {
    fetchList();
  
  }, [
    // filtros
    filters.estado,
    filters.idContrato,
    filters.idCliente,
    filters.fecha,
    page,
    limit,
    sortCol,
    sortDir,
  ]);

  useEffect(() => {
    fetchAvailableContracts();
  }, []);

  // -----------------------------
  // acciones (crear / pagar)
  // -----------------------------
  const save = async () => {
    if (!form.idContrato || !form.porcentajeIVA) return;
    setLoading(true);
    setError(null);
    try {
      await createInvoice({
        idContrato: Number(form.idContrato),
        porcentajeIVA: Number(form.porcentajeIVA),
      });
      setOpen(false);
      await fetchList();
      qc.invalidateQueries({ queryKey: ["invoices"] });
    } catch (err: any) {
      const msg =
        err?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "No se pudo crear la factura";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const pagar = async (idFactura: number) => {
    setLoading(true);
    setError(null);
    try {
      await markInvoiceAsPaidAndFetch(idFactura, filters);
      await fetchList();
      qc.invalidateQueries({ queryKey: ["invoices"] });
    } catch (err: any) {
      const msg =
        err?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "No se pudo marcar como pagada";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    // datos
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

    // paginación / sort (excluye fechaEmision)
    page,
    setPage,
    limit,
    changeLimit,
    total,
    totalPages,
    nextPage,
    prevPage,
    sortCol,
    setSortCol,
    sortDir,
    setSortDir,

    // contratos para el Select del modal
    availableContracts,
  };
}
