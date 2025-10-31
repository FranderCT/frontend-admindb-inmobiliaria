import { Loader2 } from 'lucide-react'
import FormAsignarParticipantes from './FormAsignarParticipantes'
import { useGetContractParticipants } from '../hooks/contractHooks'
import { FormGestionParticipantesContratoProps } from '../types/contractTypes'
import FormElegirYEditarParticipante from './FormElegirYEditarParticipante'
import { CardDescription } from '@/components/ui/card'


export default function FormGestionParticipantesContrato({ idContrato, onSuccess, onCancel }: FormGestionParticipantesContratoProps) {
  const { participantes, tieneParticipantes, loading, fetching, isError, error } =
    useGetContractParticipants(idContrato)

  if (!loading && !fetching && !tieneParticipantes) {
    return (
      <FormAsignarParticipantes
        idContrato={idContrato}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    )
  }

  if (loading || fetching) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando participantes del contrato…
      </div>
    )
  }
  if (isError) {
    return <div className="text-sm text-red-600">Error: {error?.message ?? 'No se pudieron cargar los participantes.'}</div>
  }

  return <CardDescription>
    No puedes cambiar los participantes asignados a un contrato. 
    Si necesitas modificar los participantes, por favor anula el contrato y crea uno nuevo con los participantes correctos.
  </CardDescription>
}
