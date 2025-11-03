import { Plus, FileText, CreditCard, User, Percent, Calendar, X, Building2 } from "lucide-react";
import { InvoiceStatus } from "../types/facturasType";
import { useInvoices } from "../hooks/facturasHooks";
import { deriveClienteInfo, formatDate, formatMoney } from "../models/facturas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Can } from "@/modules/seguridad/components/Can";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


function StatusPill({ estado }: { estado: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    Pendiente: "bg-amber-500 text-white",
    Pagada: "bg-emerald-600 text-white",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[estado]}`}>{estado}</span>;
}

export default function FacturacionPage() {
  const {
    data, loading, error,
    setEstado, setContratoIdText, setClienteIdText, setFecha,
    open, setOpen, form, setForm, save, pagar
  } = useInvoices();

  return (

    <div className="m-4">
      <header className="flex items-center justify-between mb-4 ml-16">
        <h1 className="text-4xl font-bold">Facturas</h1>
      </header>

      <nav className="flex flex-wrap gap-4 justify-between mb-4 ml-16">
        {/* Filtros */}
        <div className="flex gap-3 mb-2">
          <Select
            onValueChange={(v) => setEstado(v as "Todos" | InvoiceStatus)}
            defaultValue="Todos"
          >
            <SelectTrigger className="border rounded-md px-3 py-2 bg-white shadow-sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Pagada">Pagada</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="ID del contrato"
            className="border rounded-md px-3 py-2 shadow-sm"
            inputMode="numeric"
            onChange={(e) => setContratoIdText(e.target.value)}
          />

          <Input
            placeholder="Identificación del cliente"
            className="border rounded-md px-3 py-2 shadow-sm"
            inputMode="numeric"
            onChange={(e) => setClienteIdText(e.target.value)}
          />

          <Input
            type="date"
            className="border rounded-md px-3 py-2 shadow-sm"
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <Can resource="facturas" action="create">
          <Button variant="default"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-5 h-5" /> Registrar factura
          </Button>
        </Can>
      </nav>



      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
              <Card key={k} className="h-[300px] w-70">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent className="px-2 pb-6">
                  <Skeleton className="h-[190px] w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16 border border-dashed rounded-xl">
            No hay facturas que coincidan con el filtro.
          </div>
        ) : (
          data.map((f) => {
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
                    Tipo de contrato:
                    <span>{f.tipo}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span><span className="text-gray-500">ID Propiedad:</span> {f.propiedadId}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>
                      <span className="text-gray-500">Ubicación de la propiedad:</span> {f.ubicacion}
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span><span className="text-gray-500">Agente:</span> {f.agente}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span><span className="text-gray-500"> Comisión del Agente:</span> {f.comisionPct}%</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span><span className="text-gray-500">Emitida:</span> {formatDate(f.fechaEmision)}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span><span className="text-gray-500">Fecha de pago:</span> {formatDate(f.fechaPago)}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span><span className="text-gray-500">ID contrato:</span> {f.contratoId}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {/* ↓ Único cambio visual: mostramos el texto igual que back */}
                    <span><span className="text-gray-500">Cliente:</span> {cliente.text}</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span><span className="text-gray-500"> IVA:</span> {f.porcentajeIva}%</span>
                  </li>

                  
                </ul>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-base font-semibold">{formatMoney(f.montoTotal)}</p>
                  <div className="flex gap-2">
                    {f.estado === "Pendiente" && (
                      <button
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50"
                        onClick={() => pagar(f.id)}
                      >
                        Marcar pagada
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal: ID Contrato + IVA */}
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
                  <span className="text-sm text-gray-600">ID Contrato</span>
                  <input
                    type="text"             // texto para controlar "" y número
                    inputMode="numeric"
                    className="border rounded-md px-3 py-2"
                    value={form.idContrato === "" ? "" : String(form.idContrato)}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setForm((s) => ({
                        ...s,
                        idContrato: raw === "" ? "" : Number(raw), // ← único cambio
                      }));
                    }}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">IVA (%)</span>
                  <input
                    type="number"
                    min={0}
                    className="border rounded-md px-3 py-2"
                    value={form.porcentajeIVA}
                    onChange={(e) => setForm((s) => ({ ...s, porcentajeIVA: Number(e.target.value) }))}
                  />
                </label>
              </div>

              <div className="px-6 pb-6 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-md border" onClick={() => setOpen(false)}>
                  Cancelar
                </button>
                <button className="px-4 py-2 rounded-md text-white bg-[#708C3E] hover:opacity-90" onClick={save}>
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
