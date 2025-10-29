import { InvoiceItem, InvoiceStatus, RolCliente } from "../types/facturasType";

export function mapFacturaApiToInvoice(api: any): InvoiceItem {
  const estado: InvoiceStatus = api.estadoPago ? "Pagada" : "Pendiente";

  // ⬇️ Cambio mínimo: aceptar ambos alias del back
  const parsed = parseClientePrincipal(api?.cliente ?? api?.clientePrincipal);

  return {
    id: api.idFactura,
    tipo: api.tipoContrato,
    propiedadId: api.idPropiedad,
    periodo: { inicio: api.fechaEmision ?? null, fin: api.fechaEmision ?? null },
    agente: api.nombreAgente ?? "",
    comisionPct: Number(api.porcentajeComision ?? 0),
    fechaEmision: api.fechaEmision ?? null,
    fechaPago: api.fechaPago ?? null,
    contratoId: api.idContrato,
    montoTotal: Number(api.montoPagado ?? 0),
    estado,

    // ⬇️ Cambio mínimo: normalizar string de cliente desde /todas (clientePrincipal) o /filtradas (cliente)
    clientes: api.clientes ?? api.cliente ?? api.clientePrincipal ?? "",

    // Guardamos el cliente principal desglosado
    clienteId: parsed?.id ?? undefined,
    clienteNombre: parsed?.name ?? undefined,
    rolCliente: parsed?.rol ?? undefined,
  };
}

function parseClientePrincipal(
  src: unknown
): { id: string; name?: string; rol?: RolCliente } | null {
  if (!src) return null;
  const s = String(src).trim();
  if (!s || s.toLowerCase() === "no asignado") return null;

  const m = s.match(/^\s*(\d+)\s*-\s*(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    const id = m[1];
    const name = m[2];
    const rol = m[3] as RolCliente;
    return { id, name, rol };
  }

  const m2 = s.match(/^\s*(\d+)\s*-\s*(.+)\s*$/);
  if (m2) {
    return { id: m2[1], name: m2[2] };
  }

  const m3 = s.match(/^(\d+)/);
  return m3 ? { id: m3[1] } : null;
}

/** Formatea colones */
export const formatMoney = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export const formatDate = (iso?: string | null) => {
  if (!iso) return "—";

  const dateLike = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso;
  const d = new Date(dateLike);
  return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString("es-CR");
};

export function deriveClienteInfo(f: InvoiceItem): { text: string } {
  const anyF = f as any;
  const raw: string =
    anyF?.clienteText ??
    anyF?.cliente ??
    anyF?.clientePrincipal ??
    anyF?.clientes ??
    "";

  return { text: raw?.trim() ? raw : "—" };
}
