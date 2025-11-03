import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { Button } from '@/components/ui/button'
import { useGetHistorialAgente } from '../hooks/agentesHooks'
import { Badge } from '@/components/ui/badge'
import { estadoContratoVariant } from '@/utils/statusVariants'

function ContenidoHistorial({
  agenteNombre,
  identificacion,
}: {
  agenteNombre: string
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
          Contratos en los que ha participado {agenteNombre}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <div className=" space-y-2">
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
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700
         scrollbar-track-gray-100 ">
                {contratos.map((c: any) => (
                  <div key={c.idContrato} className="rounded border p-3 text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {c.tipoContrato} · #{c.idContrato}
                      </span>
                      <Badge variant={estadoContratoVariant[c.estado]}>
                        {c.estado}
                      </Badge>
                    </div>

                    <div className="text-muted-foreground text-xs">
                      {c.propiedadUbicacion}
                      {c.fechaFirma
                        ? ` · ${new Date(c.fechaFirma).toLocaleDateString()}`
                        : ''}
                    </div>

                    <div className="text-xs">
                      <p>Monto total: ₡{Number(c.montoTotal ?? 0).toLocaleString()}
                      {c.tipoContrato === 'Alquiler' ? ' · Depósito: ₡' + Number(c.deposito ?? 0).toLocaleString()
                        : ''}</p>
                       <p>Comisión: {c.porcentajeComision}%</p>
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
