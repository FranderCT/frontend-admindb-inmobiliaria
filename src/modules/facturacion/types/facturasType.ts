export type InvoiceStatus = "Pendiente" | "Pagada";
export type RolCliente = "Inquilino" | "Arrendatario" | "Comprador" | "Vendedor";
export type SortCol = 'idFactura' | 'montoPagado' | 'estadoPago';
export type SortDir = 'ASC' | 'DESC';


export interface InvoiceItem {
  id: number;
  tipo: "Venta" | "Alquiler";
  propiedadId: number;
  ubicacion: string;
  periodo: { inicio: string; fin: string };
  agente: string;
  comisionPct: number;
  montoComisionAgente?: number;
  fechaEmision: string; 
  fechaPago: string;    
  contratoId: number;
  montoTotal: number;
  estado: InvoiceStatus;
  porcentajeIva: number;
  montoIva?: number;


  clientes: string;

 
  clienteId?: string;
  clienteNombre?: string;
  rolCliente?: RolCliente;
}

export interface InvoiceFilters {
  estado: "Todos" | InvoiceStatus;
  idContrato?: string; // texto
  idCliente?: string;  // texto
  fecha?: string;      // YYYY-MM-DD
}


export interface CreateInvoiceForm {
  idContrato: number | "";   
  porcentajeIVA: number;
}
export interface PaginationParams {
  page: number;
  limit: number;
  sortCol?: SortCol;
  sortDir?: SortDir;
  q?: string;
}

export interface PaginatedInvoices {
  items: InvoiceItem[];
  total: number;
  page: number;
  limit: number;
}
