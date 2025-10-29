import { useEffect, useMemo, useState } from "react";
import {
  createInvoice,
  getAllInvoices,
  getFilteredInvoices,
  markInvoiceAsPaidAndFetch,
} from "../services/facturasServices";
import { CreateInvoiceForm, InvoiceFilters, InvoiceItem, InvoiceStatus } from "../types/facturasType";

const defaultFilters: InvoiceFilters = {
  estado: "Todos",
  idContrato: "",
  idCliente: "",
  fecha: "",
};

export function useInvoices() {
  const [data, setData] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros controlados desde la página
  const [filters, setFilters] = useState<InvoiceFilters>(defaultFilters);

  // modal crear
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateInvoiceForm>({ idContrato: "", porcentajeIVA: 13 });

  const anyFilter =
    filters.estado !== "Todos" ||
    !!filters.idContrato ||
    !!filters.idCliente ||
    !!filters.fecha;

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = anyFilter ? await getFilteredInvoices(filters) : await getAllInvoices();
      setData(rows);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    
  }, [filters.estado, filters.idContrato, filters.idCliente, filters.fecha]);

  const setEstado = (estado: "Todos" | InvoiceStatus) =>
    setFilters((s) => ({ ...s, estado }));
  const setContratoIdText = (v: string) => setFilters((s) => ({ ...s, idContrato: v }));
  const setClienteIdText = (v: string) => setFilters((s) => ({ ...s, idCliente: v }));
  const setFecha = (v: string) => setFilters((s) => ({ ...s, fecha: v }));

const save = async () => {
  try {
    const idNum = Number(form.idContrato);
    if (!idNum || Number.isNaN(idNum)) return;

    await createInvoice({
      idContrato: idNum,                                   // ← número
      porcentajeIVA: Number(form.porcentajeIVA ?? 13),
    });

    await fetchList();
    setOpen(false);
    setForm({ idContrato: "", porcentajeIVA: 13 });
  } catch (e) {
    console.error(e);
    setError((e as any)?.message ?? "No se pudo crear la factura");
  }
};



  
  const pagar = async (id: number) => {
    try {
      setLoading(true);
      const rows = await markInvoiceAsPaidAndFetch(id, filters);
      setData(rows);
    } catch (e) {
      console.error(e);
      setError((e as any)?.message ?? "No se pudo marcar como pagada");
    } finally {
      setLoading(false);
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
  };
}
