import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { useGetHistorialCliente } from '../hooks/clientesHooks'
import { Button } from '@/components/ui/button'

function ContenidoHistorial({
  clienteNombre,
  telefono,
  identificacion,
}: {
  clienteNombre: string
  telefono: string
  identificacion: string
}) {
  const {
    //cliente,
    loadingCliente,
    fetchingCliente,
    errorCliente,
  } = useGetHistorialCliente(identificacion)

  return (
    <>
      <AlertDialogHeader className="mb-2 pr-10">
        <AlertDialogTitle className="text-lg">Historial del cliente</AlertDialogTitle>
      </AlertDialogHeader>

      <div className="space-y-1 text-sm">
        <h3 className="font-semibold">{clienteNombre}</h3>
        <p className="text-muted-foreground">{identificacion}</p>
        <p className="text-muted-foreground">{telefono}</p>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-sm">Historial de contratos</h3>

        {(loadingCliente || fetchingCliente) && (
          <div className="space-y-2">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
          </div>
        )}

        {errorCliente && (
          <p className="text-sm text-destructive">No se pudo cargar el historial.</p>
        )}

        {!loadingCliente && !fetchingCliente && !errorCliente && (
          <>
            
          </>
        )}
      </div>

      <AlertDialogFooter className="mt-6">
        <AlertDialogCancel asChild>
          <Button variant="outline">Cerrar</Button>
        </AlertDialogCancel>
      </AlertDialogFooter>
    </>
  )
}
export default ContenidoHistorial