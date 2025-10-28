// src/modules/facturacion/models/invoice.model.ts
import { InvoiceItem, InvoiceStatus, RolCliente } from "../types/facturasType";

/** API -> UI mapper
 * Estructura esperada desde GET /facturas/todas o /filtradas:
 * {
 *   idFactura: number, tipoContrato: "Venta"|"Alquiler", idPropiedad: number,
 *   nombreAgente: string, porcentajeComision: number, fechaEmision: string, fechaPago: string,
 *   estadoPago: boolean, idContrato: number, clientes: string, montoPagado: number
 * }
 */
export function mapFacturaApiToInvoice(api: any): InvoiceItem {
  const estado: InvoiceStatus = api?.estadoPago ? "Pagada" : "Pendiente";

  return {
    id: api?.idFactura,
    tipo: api?.tipoContrato,
    propiedadId: api?.idPropiedad,
    periodo: { inicio: api?.fechaEmision, fin: api?.fechaEmision },
    agente: api?.nombreAgente ?? "",
    comisionPct: api?.porcentajeComision ?? 0,
    fechaEmision: api?.fechaEmision,
    fechaPago: api?.fechaPago,
    contratoId: api?.idContrato,
    montoTotal: api?.montoPagado ?? 0,
    estado,

    // 🔹 Necesario para cumplir con InvoiceItem
    clientes: String(api?.clientes ?? ""), // <<--- agregado

    // Derivados a partir del string "clientes" (opcionales en el tipo)
    clienteId: deriveClienteId(api),
    rolCliente: deriveRolCliente(api),
  };
}

/** Deriva el ID de cliente desde el string `clientes`
 *  Ej: "904487878 - Nixon Pérez (Vendedor)"  -> "904487878"
 */
function deriveClienteId(api: any): string | undefined {
  if (!api?.clientes) return undefined;
  const match = String(api.clientes).match(/^(\d+)/);
  return match ? match[1] : undefined;
}

/** Deriva el rol desde el string `clientes`
 *  Ej: "... (Vendedor)" -> "Vendedor"
 */
function deriveRolCliente(api: any): RolCliente | undefined {
  if (!api?.clientes) return undefined;
  const m = String(api.clientes).match(/\(([^)]+)\)\s*$/);
  if (!m) return undefined;
  const role = m[1].trim();
  if (role === "Vendedor" || role === "Comprador" || role === "Inquilino" || role === "Arrendatario") {
    return role as RolCliente;
  }
  return undefined;
}

/** Helper usado por la tarjeta para mostrar ID y rol cuando no vienen explícitos */
export function deriveClienteInfo(f: InvoiceItem) {
  const id = f.clienteId ?? `CL-${String(f.contratoId).padStart(3, "0")}`;
  const role: RolCliente =
    f.rolCliente ?? (f.tipo === "Alquiler" ? "Inquilino" : "Comprador");
  return { id, role } as const;
}

/** Formateadores */
export const formatMoney = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-CR");
};
