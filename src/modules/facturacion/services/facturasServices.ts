import { mapFacturaApiToInvoice } from "../models/facturas";
import { CreateInvoiceForm, InvoiceFilters, InvoiceItem } from "../types/facturasType";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function toQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "" || Number.isNaN(v)) return;
    q.append(k, String(v));
  });
  return q.toString();
}

/** GET /facturas/todas */
export async function getAllInvoices(): Promise<InvoiceItem[]> {
  const res = await fetch(`${API_BASE}/facturas/todas`, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudo obtener facturas");
  const json = await res.json();
  return Array.isArray(json) ? json.map(mapFacturaApiToInvoice) : [];
}

/** GET /facturas/filtradas (cambia a /todas si no hay filtros) */
export async function getFilteredInvoices(filters: InvoiceFilters): Promise<InvoiceItem[]> {
  const estadoPago =
    filters.estado === "Todos" ? undefined : filters.estado === "Pagada" ? true : false;

  const query = toQuery({
    estadoPago,
    idContrato: filters.idContrato ? Number(filters.idContrato) : undefined,
    idCliente: filters.idCliente ? Number(filters.idCliente) : undefined,
    fecha: filters.fecha || undefined,
  });

  const url = query
    ? `${API_BASE}/facturas/filtradas?${query}`
    : `${API_BASE}/facturas/todas`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudo obtener facturas");
  const json = await res.json();
  return Array.isArray(json) ? json.map(mapFacturaApiToInvoice) : [];
}

/**
 * POST /facturas/crear
 * IMPORTANTE: el SP no devuelve tipoContrato / propiedad / agente / comisión,
 * así que NO usamos esta respuesta para pintar la card. Solo creamos y luego
 * hacemos un refetch con GET /facturas/todas o /filtradas.
 */
export async function createInvoice(body: CreateInvoiceForm): Promise<void> {
  const res = await fetch(`${API_BASE}/facturas/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      idContrato: Number(body.idContrato),
      porcentajeIVA: Number(body.porcentajeIVA),
    }),
  });
  if (!res.ok) {
    // devolvemos el texto de error del backend para que se vea en consola/toast
    const text = await res.text().catch(() => "");
    throw new Error(text || "No se pudo crear la factura");
  }
  // no retornamos el payload; el hook hará un refetch
}

/** PATCH /facturas/pagar/:id  → tras marcar, devolvemos la lista fresca con GET */
export async function markInvoiceAsPaidAndFetch(id: number, filters: InvoiceFilters): Promise<InvoiceItem[]> {
  const res = await fetch(`${API_BASE}/facturas/pagar/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "No se pudo marcar como pagada");
  }
  // Refrescamos usando los filtros actuales
  return await getFilteredInvoices(filters);
}
