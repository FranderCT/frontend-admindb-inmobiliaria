export type InvoiceStatus = "Pendiente" | "Pagada";
export type RolCliente = "Inquilino" | "Arrendatario" | "Comprador" | "Vendedor";

// Lo que la UI consume para cada tarjeta de factura
export interface InvoiceItem {
  id: number;
  tipo: "Venta" | "Alquiler";
  propiedadId: number;
  ubicacion: string;
  periodo: { inicio: string; fin: string };
  agente: string;
  comisionPct: number;
  montoComisionAgente?: number;
  fechaEmision: string; // ISO
  fechaPago: string;    // ISO o "" si no aplica
  contratoId: number;
  montoTotal: number;
  estado: InvoiceStatus;
  porcentajeIva: number;
  montoIva?: number;

  // String original que puede venir de la API
  clientes: string;

  // ↓ NUEVOS opcionales para mostrar el cliente principal igual que en el back
  clienteId?: string;
  clienteNombre?: string;
  rolCliente?: RolCliente;
}

// Filtros enviados al backend
// Mantener como texto porque el back compara NVARCHAR/LIKE
export interface InvoiceFilters {
  estado: "Todos" | InvoiceStatus;
  idContrato?: string; // texto
  idCliente?: string;  // texto
  fecha?: string;      // YYYY-MM-DD
}

// Formulario para crear factura (modal)
export interface CreateInvoiceForm {
  idContrato: number | "";   // ← permite número (o "" cuando el input está vacío)
  porcentajeIVA: number;
}
