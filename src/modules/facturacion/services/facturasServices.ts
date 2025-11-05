import altosDelValleAPI from "@/api/altosdelvalle";
import { mapFacturaApiToInvoice } from "../models/facturas";
import { CreateInvoiceForm, InvoiceFilters, InvoiceItem, PaginatedInvoices, PaginationParams } from "../types/facturasType";


export async function getAllInvoices(): Promise<InvoiceItem[]> {
  const { data } = await altosDelValleAPI.get("/facturas/todas");
  return Array.isArray(data) ? data.map(mapFacturaApiToInvoice) : [];
}


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

function buildSearchQ(filters: InvoiceFilters): string | undefined {
  const parts: string[] = [];
  if (filters.idContrato) parts.push(String(filters.idContrato));
  if (filters.idCliente) parts.push(String(filters.idCliente));
  if (filters.fecha) parts.push(String(filters.fecha));
  return parts.length ? parts.join(" ") : undefined;
}

export async function getInvoicesPaginated(
  filters: InvoiceFilters,
  pg: PaginationParams
): Promise<PaginatedInvoices> {
  // 1) SI EL ESTADO ESTÁ FIJADO → usar /facturas/filtradas y paginar en cliente
  if (filters.estado && filters.estado !== "Todos") {
    const all = await getFilteredInvoices(filters); // ya viene mapeado
    const total = all.length;
    const start = Math.max(0, (pg.page - 1) * pg.limit);
    const items = all.slice(start, start + pg.limit);
    return { items, total, page: pg.page, limit: pg.limit };
  }

  // 2) Caso normal → /facturas/paginate
  const safeSortCol =
    (pg as any)?.sortCol === 'fechaEmision' ? 'idFactura' : (pg.sortCol ?? 'idFactura');
  const safeSortDir = pg.sortDir ?? 'ASC';

  const { data } = await altosDelValleAPI.get("/facturas/paginate", {
    params: {
      page: pg.page,
      limit: pg.limit,
      sortCol: safeSortCol,
      sortDir: safeSortDir,
      q: pg.q ?? buildSearchQ(filters),
      // (no enviamos estadoPago aquí porque ese filtro vive en /facturas/filtradas)
    },
  });

  const payload = data ?? {};
  const rowsAny =
    payload.items ??
    payload.rows ??
    payload.data ??
    payload.result ??
    (Array.isArray(payload) ? payload : []);
  const rows: any[] = Array.isArray(rowsAny) ? rowsAny : [];

  // total “inteligente” por si el backend no lo manda
  const metaTotal = payload.total ?? payload.count ?? payload.totalCount;
  const totalNum = Number.isFinite(Number(metaTotal))
    ? Number(metaTotal)
    : ((pg.page - 1) * pg.limit) + rows.length + (rows.length === pg.limit ? 1 : 0);

  return {
    items: rows.map(mapFacturaApiToInvoice),
    total: totalNum,
    page: Number(payload.page ?? pg.page),
    limit: Number(payload.limit ?? pg.limit),
  };
}



