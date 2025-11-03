import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { useGetHistorialCliente } from '../hooks/clientesHooks'
import { Button } from '@/components/ui/button'
import { DetalleHistorialClienteProps } from '../types/clientTypes'
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function ContenidoHistorialCliente({ clienteNombre, telefono, identificacion }: DetalleHistorialClienteProps) {
  const {
    cliente,
    loadingCliente,
    fetchingCliente,
    errorCliente,
  } = useGetHistorialCliente(identificacion)

  const isLoading = loadingCliente || fetchingCliente
  const items = Array.isArray(cliente) ? cliente : []

  const fmtDate = (d?: string | null) =>
    d ? new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(d)) : '—'

  const fmtMoney = (n?: number | null) =>
    typeof n === 'number'
      ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)
      : '—'

  const badge = (text: string, variant: 'default' | 'success' | 'warning' | 'destructive' = 'default') => {
    const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border'
    const map = {
      default: 'border-border bg-muted/50 text-foreground',
      success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
      warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
      destructive: 'border-red-500/30 bg-red-500/10 text-red-700',
    } as const
    return <span className={`${base} ${map[variant]}`}>{text}</span>
  }

  const estadoVariant = (estado?: string) => {
    if (!estado) return 'default' as const
    const e = estado.toLowerCase()
    if (e.includes('pend')) return 'warning' as const
    if (e.includes('final') || e.includes('complet')) return 'success' as const
    if (e.includes('cancel')) return 'destructive' as const
    return 'default' as const
  }

  const rolTexto = (item: any) =>
    (Array.isArray(item?.['']) && typeof item[''][2] === 'string' && item[''][2]) ||
    (Array.isArray(item?.nombre) && typeof item.nombre[1] === 'string' && item.nombre[1]) ||
    ''

  const tipoContratoTexto = (item: any) =>
    (Array.isArray(item?.nombre) && typeof item.nombre[2] === 'string' && item.nombre[2]) ||
    (item?.idTipoContrato === 1 ? 'Venta' : item?.idTipoContrato === 2 ? 'Alquiler' : `Tipo ${item?.idTipoContrato}`)

  return (
    <>
      <AlertDialogHeader className="mb-2 pr-10">
        <AlertDialogTitle className="text-lg">Historial de participación de {clienteNombre}</AlertDialogTitle>
      </AlertDialogHeader>

      <div className="space-y-1 text-sm">
        <h3 className="font-semibold">{clienteNombre} </h3>
        <p className="text-muted-foreground">Identificacion: {identificacion}</p>
        <p className="text-muted-foreground">Telefono: {telefono || '—'}</p>
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-sm mb-2">Historial de contratos</h3>

        <div
          className="
            relative
            max-h-[46vh]
            overflow-y-auto
            pr-2  
            -mr-2
            space-y-3 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700
         scrollbar-track-gray-100 
          "
        >
          {isLoading && (
            <Card className="h-[300px] w-70">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent className="px-2 pb-6">
                <Skeleton className="h-[190px] w-full rounded-md" />
              </CardContent>
            </Card>
          )}

          {errorCliente && (
            <p className="text-sm text-destructive">No se pudo cargar el historial.</p>
          )}

          {!isLoading && !errorCliente && items.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin contratos registrados.</p>
          )}

          {!isLoading && !errorCliente && items.length > 0 && (
            <ul className="space-y-2">
              {items.map((it) => (
                <li
                  key={`${it.idContrato}-${it.idClienteContrato}`}
                  className="rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {badge(tipoContratoTexto(it))}
                    {badge(rolTexto(it))}
                    {badge(it.estado ?? '—', estadoVariant(it.estado))}
                    <span className="text-xs text-muted-foreground">
                      Contrato #{it.idContrato} • Propiedad {it.idPropiedad}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Ubicación</span>
                        <span className="font-medium">{it.ubicacion || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Precio</span>
                        <span className="font-medium">{fmtMoney(it.precio)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monto total</span>
                        <span className="font-medium">{fmtMoney(it.montoTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Depósito</span>
                        <span className="font-medium">{fmtMoney(it.deposito)}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {tipoContratoTexto(it) === 'Alquiler' && (
                        <>
                          z
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Inicio</span>
                            <span className="font-medium">{fmtDate(it.fechaInicio)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Fin</span>
                            <span className="font-medium">{fmtDate(it.fechaFin)}</span>
                          </div>                        
                        </>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Firma</span>
                        <span className="font-medium">{fmtDate(it.fechaFirma)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Últ. factura</span>
                        <span className="font-medium">{fmtDate(it.ultima_factura_emision)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Pagos: <span className="font-medium">{it.cantidadPagos ?? '—'}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Comisión: <span className="font-medium">{(it.porcentajeComision ?? 0) + '%'}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Agente: <span className="font-medium">{Array.isArray(it?.nombre) ? it.nombre[3] ?? '—' : '—'}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AlertDialogFooter className="mt-2">
        <AlertDialogCancel asChild>
          <Button variant="outline">Cerrar</Button>
        </AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}

export default ContenidoHistorialCliente
