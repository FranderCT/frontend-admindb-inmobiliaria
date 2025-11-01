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
  telefono,         // se mantiene por compatibilidad, no se muestra
  identificacion,   // se mantiene por compatibilidad, no se muestra
}: {
  agenteNombre: string
  telefono: string
  identificacion: string
}) {
  const {
    loadingAgente,
    fetchingAgente,
    errorAgente,
    contratos,
  } = useGetHistorialAgente(identificacion)

  return (
    <>
      <AlertDialogHeader className="mb-2 pr-10">
        <AlertDialogTitle className="text-lg">
          Contratos en los que ha Participado un Agente
        </AlertDialogTitle>
      </AlertDialogHeader>

      <div className="space-y-1 text-sm">
        <h3 className="font-semibold">{agenteNombre}</h3>
        {/* Líneas removidas: identificación y teléfono */}
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
            {(!contratos || contratos.length === 0) ? (
              <p className="text-sm text-muted-foreground">
                Sin contratos para este agente.
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {contratos.map((c: any) => (
                  <div key={c.idContrato} className="rounded border p-3 text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {c.tipoContrato} · #{c.idContrato}
                      </span>
                      <span className="text-muted-foreground">{c.estado}</span>
                    </div>

                    <div className="text-muted-foreground text-xs">
                      {c.propiedadUbicacion}
                      {c.fechaFirma
                        ? ` · ${new Date(c.fechaFirma).toLocaleDateString()}`
                        : ''}
                    </div>

                    <div className="text-xs">
                      Monto total: ₡{Number(c.montoTotal ?? 0).toLocaleString()} · Depósito: ₡
                      {Number(c.deposito ?? 0).toLocaleString()} · Comisión: {c.porcentajeComision}%
                    </div>
                  </div>
                ))}
              </div>
            )}
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
