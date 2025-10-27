import { useMemo, useState } from "react";
import {
  Calendar,
  CreditCard,
  FileText,
  Pencil,
  Plus,
  User,
  Percent,
  X,
} from "lucide-react";

// Solo estos dos estados
export type InvoiceStatus = "Pendiente" | "Pagada";
export type RolCliente = "Inquilino" | "Arrendatario" | "Comprador" | "Vendedor";

export interface InvoiceItem {
  id: number;
  tipo: "Venta" | "Alquiler";
  propiedadId: number;
  periodo: { inicio: string; fin: string };
  agente: string;
  comisionPct: number;
  fechaEmision: string;
  fechaPago: string;
  contratoId: number;
  montoTotal: number;
  estado: InvoiceStatus;
  clienteId?: string;
  rolCliente?: RolCliente;
}

const MOCK_INVOICES: InvoiceItem[] = [
  // de ejemplo: mezcla de Pendiente y Pagada
  { id: 1, tipo: "Venta", propiedadId: 1, periodo: { inicio: "2025-10-20", fin: "2025-10-20" }, agente: "Maria Lopez", comisionPct: 3, fechaEmision: "2025-10-20", fechaPago: "2025-10-20", contratoId: 101, montoTotal: 2500000, estado: "Pagada" },
  { id: 2, tipo: "Alquiler", propiedadId: 1, periodo: { inicio: "2025-10-20", fin: "2025-10-20" }, agente: "Maria Lopez", comisionPct: 5, fechaEmision: "2025-10-20", fechaPago: "2025-10-20", contratoId: 102, montoTotal: 350000, estado: "Pagada" },
  { id: 3, tipo: "Alquiler", propiedadId: 1, periodo: { inicio: "2025-10-20", fin: "2025-10-20" }, agente: "Maria Lopez", comisionPct: 5, fechaEmision: "2025-10-20", fechaPago: "2025-10-20", contratoId: 103, montoTotal: 385000, estado: "Pendiente" },
  { id: 4, tipo: "Venta", propiedadId: 1, periodo: { inicio: "2025-10-20", fin: "2025-12-20" }, agente: "Maria Lopez", comisionPct: 3, fechaEmision: "2025-10-20", fechaPago: "2025-10-20", contratoId: 104, montoTotal: 1900000, estado: "Pendiente" },
  { id: 5, tipo: "Alquiler", propiedadId: 3, periodo: { inicio: "2025-09-01", fin: "2025-09-30" }, agente: "Axel Chaves", comisionPct: 4, fechaEmision: "2025-09-01", fechaPago: "2025-09-30", contratoId: 105, montoTotal: 280000, estado: "Pendiente" },
  { id: 6, tipo: "Alquiler", propiedadId: 7, periodo: { inicio: "2025-08-01", fin: "2025-08-31" }, agente: "Axel Chaves", comisionPct: 4, fechaEmision: "2025-08-01", fechaPago: "2025-08-31", contratoId: 106, montoTotal: 300000, estado: "Pagada" },
];

// Opciones “quemadas” del modal
const AGENTES = ["Maria Lopez", "Axel Chaves", "Greilyn Esquivel", "Katheryn Méndez"] as const;

const CONTRATOS = [
  { id: 101, tipo: "Venta" as const, propiedadId: 1, base: 2500000, fechaEmision: "2025-10-20", fechaPago: "2025-10-20" },
  { id: 102, tipo: "Alquiler" as const, propiedadId: 1, base: 350000, fechaEmision: "2025-10-20", fechaPago: "2025-10-20" },
  { id: 103, tipo: "Alquiler" as const, propiedadId: 1, base: 385000, fechaEmision: "2025-10-20", fechaPago: "2025-10-20" },
  { id: 104, tipo: "Venta" as const, propiedadId: 1, base: 1900000, fechaEmision: "2025-10-20", fechaPago: "2025-10-20" },
  { id: 105, tipo: "Alquiler" as const, propiedadId: 3, base: 280000, fechaEmision: "2025-09-01", fechaPago: "2025-09-30" },
  { id: 106, tipo: "Alquiler" as const, propiedadId: 7, base: 300000, fechaEmision: "2025-08-01", fechaPago: "2025-08-31" },
];

const formatMoney = (n: number) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-CR");

function deriveClienteInfo(f: InvoiceItem) {
  const id = f.clienteId ?? `CL-${String(f.contratoId).padStart(3, "0")}`;
  const role = f.rolCliente ?? (f.tipo === "Alquiler" ? ("Inquilino" as RolCliente) : ("Comprador" as RolCliente));
  return { id, role } as const;
}

function StatusPill({ estado }: { estado: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    Pendiente: "bg-amber-500 text-white",
    Pagada: "bg-emerald-600 text-white",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[estado]}`}>{estado}</span>;
}

export default function FacturacionPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(MOCK_INVOICES);

  // filtros
  const [estado, setEstado] = useState<"Todos" | InvoiceStatus>("Todos");
  const [contrato, setContrato] = useState("");
  const [fecha, setFecha] = useState("");
  const [clienteId, setClienteId] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    agente: AGENTES[0] as (typeof AGENTES)[number],
    contratoId: CONTRATOS[0].id,
    ivaPct: 13,
  });

  const data = useMemo(() => {
    return invoices.filter((f) => {
      const byEstado = estado === "Todos" ? true : f.estado === estado;
      const byContrato = contrato ? String(f.contratoId).includes(contrato.trim()) : true;
      const byFecha = fecha ? f.fechaEmision === fecha : true;
      const byCliente = clienteId ? deriveClienteInfo(f).id.toLowerCase().includes(clienteId.toLowerCase().trim()) : true;
      return byEstado && byContrato && byFecha && byCliente;
    });
  }, [invoices, estado, contrato, fecha, clienteId]);

  const nextId = () => (invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1);

  const handleSave = () => {
    if (!form.agente || !form.contratoId || form.ivaPct < 0) return;

    const contratoSel = CONTRATOS.find((c) => c.id === Number(form.contratoId));
    if (!contratoSel) return;

    const base = contratoSel.base;
    const montoConIVA = Math.round(base * (1 + Number(form.ivaPct) / 100));

    // Por defecto TODAS las nuevas → Pendiente
    const estadoInsert: InvoiceStatus = "Pendiente";

    const nuevo: InvoiceItem = {
      id: nextId(),
      tipo: contratoSel.tipo,
      propiedadId: contratoSel.propiedadId,
      periodo: { inicio: contratoSel.fechaEmision, fin: contratoSel.fechaEmision },
      agente: form.agente,
      comisionPct: 3,
      fechaEmision: contratoSel.fechaEmision,
      fechaPago: contratoSel.fechaPago,
      contratoId: contratoSel.id,
      montoTotal: montoConIVA,
      estado: estadoInsert,
      clienteId: `CL-${String(contratoSel.id).padStart(3, "0")}`,
      rolCliente: contratoSel.tipo === "Alquiler" ? "Inquilino" : "Comprador",
    };

    setInvoices((prev) => [nuevo, ...prev]);
    setOpen(false);
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Facturas</h1>
        <button
          className="inline-flex items-center gap-2 bg-[#708C3E] hover:opacity-90 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-5 h-5" /> Crear factura
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select className="border rounded-md px-3 py-2 bg-white shadow-sm" value={estado} onChange={(e) => setEstado(e.target.value as any)}>
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagada">Pagada</option>
        </select>

        <input placeholder="Filtrar por ID contrato" className="border rounded-md px-3 py-2 shadow-sm" value={contrato} onChange={(e) => setContrato(e.target.value)} />

        <input placeholder="Filtrar por ID cliente (p. ej. CL-101)" className="border rounded-md px-3 py-2 shadow-sm" value={clienteId} onChange={(e) => setClienteId(e.target.value)} />

        <input type="date" className="border rounded-md px-3 py-2 shadow-sm" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((f) => {
          const cliente = deriveClienteInfo(f);
          return (
            <article key={f.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <header className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">#{f.id}</h3>
                <StatusPill estado={f.estado} />
              </header>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{f.tipo}</span>
                </li>

                <li className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500">Propiedad:</span> {f.propiedadId}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500">Agente:</span> {f.agente}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500"> Comisión:</span> {f.comisionPct}%
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500">Emitida:</span> {formatDate(f.fechaEmision)}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500">Fecha de pago:</span> {formatDate(f.fechaPago)}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500">ID contrato:</span> {f.contratoId}
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    <span className="text-gray-500">Cliente:</span> {cliente.id} • {cliente.role}
                  </span>
                </li>
              </ul>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-base font-semibold">{formatMoney(f.montoTotal)}</p>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50">
                  <Pencil className="w-4 h-4" /> Editar
                </button>
              </div>
            </article>
          );
        })}

        {data.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-16 border border-dashed rounded-xl">
            No hay facturas que coincidan con el filtro.
          </div>
        )}
      </div>

      {/* Modal: Agente + Contrato + IVA */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Nueva factura</h2>
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => setOpen(false)} aria-label="Cerrar">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Agente</span>
                  <select
                    className="border rounded-md px-3 py-2"
                    value={form.agente}
                    onChange={(e) => setForm((s) => ({ ...s, agente: e.target.value as (typeof AGENTES)[number] }))}
                  >
                    {AGENTES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Contrato</span>
                  <select
                    className="border rounded-md px-3 py-2"
                    value={form.contratoId}
                    onChange={(e) => setForm((s) => ({ ...s, contratoId: Number(e.target.value) }))}
                  >
                    {CONTRATOS.map((c) => (
                      <option key={c.id} value={c.id}>
                        #{c.id} • {c.tipo} • ₡{c.base.toLocaleString("es-CR")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">IVA (%)</span>
                  <input
                    type="number"
                    min={0}
                    className="border rounded-md px-3 py-2"
                    value={form.ivaPct}
                    onChange={(e) => setForm((s) => ({ ...s, ivaPct: Number(e.target.value) }))}
                  />
                </label>
              </div>

              <div className="px-6 pb-6 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-md border" onClick={() => setOpen(false)}>
                  Cancelar
                </button>
                <button className="px-4 py-2 rounded-md text-white bg-[#708C3E] hover:opacity-90" onClick={handleSave}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
