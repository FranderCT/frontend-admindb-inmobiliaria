import altosDelValleAPI from "@/api/altosdelvalle";
import { mapFacturaApiToInvoice } from "../models/facturas";
import { CreateInvoiceForm, InvoiceFilters, InvoiceItem } from "../types/facturasType";

/** GET /facturas/todas */
export async function getAllInvoices(): Promise<InvoiceItem[]> {
  const { data } = await altosDelValleAPI.get("/facturas/todas");
  return Array.isArray(data) ? data.map(mapFacturaApiToInvoice) : [];
}

/** GET /facturas/filtradas (cambia a /todas si no hay filtros) */
export async function getFilteredInvoices(filters: InvoiceFilters): Promise<InvoiceItem[]> {
  const estadoPago =
    filters.estado === "Todos" ? undefined : filters.estado === "Pagada" ? true : false;

  const hasFilters =
    estadoPago !== undefined ||
    !!filters.idContrato ||
    !!filters.idCliente ||
    !!filters.fecha;

  if (!hasFilters) {
    return getAllInvoices();
  }

  const { data } = await altosDelValleAPI.get("/facturas/filtradas", {
    params: {
      estadoPago,
      idContrato: filters.idContrato ? Number(filters.idContrato) : undefined,
      idCliente: filters.idCliente ? Number(filters.idCliente) : undefined,
      fecha: filters.fecha || undefined,
    },
  });

  return Array.isArray(data) ? data.map(mapFacturaApiToInvoice) : [];
}

export async function createInvoice(body: CreateInvoiceForm): Promise<void> {
  try {
    await altosDelValleAPI.post("/facturas/crear", {
      idContrato: Number(body.idContrato),
      porcentajeIVA: Number(body.porcentajeIVA),
    });
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      (typeof err?.response?.data === "string" ? err.response.data : "") ||
      err?.message ||
      "No se pudo crear la factura";
    throw new Error(msg);
  }
}

/** PATCH /facturas/pagar/:id  → tras marcar, devolvemos la lista fresca con GET */
export async function markInvoiceAsPaidAndFetch(
  id: number,
  filters: InvoiceFilters
): Promise<InvoiceItem[]> {
  try {
    await altosDelValleAPI.patch(`/facturas/pagar/${id}`);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      (typeof err?.response?.data === "string" ? err.response.data : "") ||
      err?.message ||
      "No se pudo marcar como pagada";
    throw new Error(msg);
  }
  return await getFilteredInvoices(filters);
}

export async function getAvailableContracts(): Promise<Array<{ idContrato: number; tipoContrato: string }>> {
  const { data } = await altosDelValleAPI.get("/facturas/contratos/disponibles");
  return Array.isArray(data)
    ? data.map((d: any) => ({
        idContrato: Number(d.idContrato),
        tipoContrato: String(d.tipoContrato),
      }))
    : [];
}

