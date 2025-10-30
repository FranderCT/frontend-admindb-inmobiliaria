import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useGetContractRoleType, useUpdateContractParticipant } from '../hooks/contractHooks'
import { ParticipanteMin } from '../types/contractTypes'

function FormElegirYEditarParticipante({
  idContrato,
  participantes,
  onSuccess,
}: {
  idContrato: number
  participantes: ParticipanteMin[]
  onSuccess?: () => void
}) {
  const [selectedId, setSelectedId] = useState<string>('')

  const seleccionado = useMemo(
    () => participantes.find(p => String(p.idClienteContrato) === selectedId),
    [participantes, selectedId]
  )

  const { contractRoleTypes = [], loadingContractRoleTypes, errorContractRoleTypes } = useGetContractRoleType()
  const [idRol, setIdRol] = useState<string>('') 
  const update = useUpdateContractParticipant(idContrato)

  const handleGuardar = async () => {
    if (!selectedId) {
      toast.error('Selecciona un participante.')
      return
    }
    if (!idRol) {
      toast.error('Selecciona un rol.')
      return
    }
    try {
      await update.mutateAsync({
          participantes: [
            {
                identificacion: Number(selectedId),
                idRol: Number(idRol),
                idContrato: idContrato
            },
          ]
      })
      toast.success('Participante actualizado.')
      onSuccess?.()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al actualizar el participante.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Editar participante del contrato #{idContrato}</h3>
        <p className="text-sm text-muted-foreground">
          Este contrato ya tiene participantes. Elige uno para editar sus atributos.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Selecciona participante</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder="Elegir…" />
            </SelectTrigger>
            <SelectContent>
              {participantes.map(p => (
                <SelectItem key={p.idClienteContrato} value={String(p.idClienteContrato)}>
                  {p.nombreCliente} ({p.rol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Rol</Label>
          <Select
            value={idRol}
            onValueChange={setIdRol}
            disabled={loadingContractRoleTypes}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingContractRoleTypes ? 'Cargando roles…' : (seleccionado ? `Actual: ${seleccionado.rol}` : 'Selecciona rol')
                }
              />
            </SelectTrigger>
            <SelectContent>
              {errorContractRoleTypes && (
                <div className="px-3 py-1 text-sm text-red-600">Error al cargar roles.</div>
              )}
              {(contractRoleTypes ?? []).map((r: { idRol: number; nombre: string }) => (
                <SelectItem key={r.idRol} value={String(r.idRol)}>
                  {r.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {seleccionado && (
            <p className="text-xs text-muted-foreground mt-1">
              Rol actual: <span className="font-medium">{seleccionado.rol}</span>
            </p>
          )}
        </div>
      </div>

      {seleccionado && (
        <div className="rounded-md border p-3">
          <div className="text-sm">
            <div><span className="text-muted-foreground">Nombre:</span> {seleccionado.nombreCliente}</div>
            <div><span className="text-muted-foreground">Identificación:</span> {seleccionado.identificacion}</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 justify-end">
        <Button onClick={handleGuardar} disabled={update.isPending || !selectedId || !idRol}>
          {update.isPending ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando…</>) : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
export default FormElegirYEditarParticipante