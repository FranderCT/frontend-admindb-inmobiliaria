import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, IdCard, Phone } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'
import { AgentCardProps } from '../types/agentTypes'
import { useDeleteAgent } from '../hooks/agentesHooks'
import DialogDetalleAgente from './DialogDetalleAgente'
import FormEditAgente from './FormEditAgente'


const CardAgente = ({ agent }: AgentCardProps) => {
  const deleteAgente = useDeleteAgent()

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const renderEstado = (status: boolean) =>
    status ? <Badge>Activo</Badge> : <Badge variant="outline">Inactivo</Badge>

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenConfirmDelete(true)
  }

  const handleConfirmDelete = async () => {
    await deleteAgente.mutateAsync(String(agent.identificacion))
  }

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenEdit(true)
  }

  const CardTrigger = (
    <Card
      key={agent.identificacion}
      className="hover:shadow-md transition-shadow hover:cursor-pointer"
      data-trigger="agente"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold">
            {agent.nombre} {agent.apellido1} {agent.apellido2}
          </CardTitle>
          {renderEstado(agent.estado)}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IdCard size={19} />
            <span>Identificación:</span>
          </div>
          <span className="font-medium">{agent.identificacion}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone size={17} />
            <span>Contacto:</span>
          </div>
          <span className="font-medium">{agent.telefono}</span>
        </div>

        <div className="flex items-center justify-between pt-3 mt-1 border-t">
          <div className="text-sm text-muted-foreground">Acciones</div>
          <div className="flex gap-1">
            <Button variant="ghost" aria-label="Editar" onClick={onEditClick}>
              <Edit size={18} />
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              aria-label="Eliminar"
              onClick={onDeleteClick}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <DialogDetalleAgente
        from="bottom"
        trigger={CardTrigger}
        agent={agent}
        identificacion={String(agent.identificacion)}
      />

      <FormEditAgente
        open={openEdit}
        onOpenChange={setOpenEdit}
        agente={{
          identificacion: agent.identificacion,
          nombre: agent.nombre,
          apellido1: agent.apellido1,
          apellido2: agent.apellido2,
          telefono: agent.telefono,
          estado: agent.estado,
        }}
      />

      <ConfirmDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        title="Desactivar agente"
        description={`¿Seguro que deseas desactivar a ${agent.nombre} ${agent.apellido1} ${agent.apellido2}? Esta acción no se puede deshacer.`}
        confirmText="Desactivar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        loading={deleteAgente.isPending as boolean}
      />
    </>
  )
}

export default CardAgente
