import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { Button } from '@/components/ui/button'
import { useGetHistorialAgente } from '../hooks/agentesHooks'

function ContenidoHistorial({
  agenteNombre,
  telefono,
  identificacion,
}: {
  agenteNombre: string
  telefono: string
  identificacion: string
}) {
  const {
    loadingAgente,
    fetchingAgente,
    errorAgente,
  } = useGetHistorialAgente(identificacion)

  return (
    <>
      <AlertDialogHeader className="mb-2 pr-10">
        <AlertDialogTitle className="text-lg">Historial del agente</AlertDialogTitle>
      </AlertDialogHeader>

      <div className="space-y-1 text-sm">
        <h3 className="font-semibold">{agenteNombre}</h3>
        <p className="text-muted-foreground">{identificacion}</p>
        <p className="text-muted-foreground">{telefono}</p>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-sm">Historial de contratos</h3>

        {(loadingAgente || fetchingAgente) && (
          <div className="space-y-2">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
          </div>
        )}

        {errorAgente && (
          <p className="text-sm text-destructive">No se pudo cargar el historial.</p>
        )}

        {!loadingAgente && !fetchingAgente && !errorAgente && (
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