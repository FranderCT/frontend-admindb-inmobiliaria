import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, IdCard, Phone } from 'lucide-react'
import type { ClientCardProps } from '../types/clientTypes'
import DialogDetalleCliente from './DialogDetalleCliente'
import { useDeleteCliente } from '../hooks/clientesHooks'
import ConfirmDialog from './ConfirmDialog'
import FormEditCliente from './FormEditCliente'

const CardCliente = ({ client }: ClientCardProps) => {
  const deleteCliente = useDeleteCliente()

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
    await deleteCliente.mutateAsync(String(client.identificacion))
  }

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenEdit(true)
  }

  const CardTrigger = (
    <Card
      key={client.identificacion}
      className="hover:shadow-md transition-shadow hover:cursor-pointer"
      data-trigger="cliente"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold">
            {client.nombre} {client.apellido1} {client.apellido2}
          </CardTitle>
          {renderEstado(client.estado)}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IdCard size={19} />
            <span>Identificación:</span>
          </div>
          <span className="font-medium">{client.identificacion}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone size={17} />
            <span>Contacto:</span>
          </div>
          <span className="font-medium">{client.telefono}</span>
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
      <DialogDetalleCliente
        from="bottom"
        trigger={CardTrigger}
        client={client}
        identificacion={String(client.identificacion)}
      />

      <FormEditCliente
        open={openEdit}
        onOpenChange={setOpenEdit}
        cliente={{
          identificacion: client.identificacion,
          nombre: client.nombre,
          apellido1: client.apellido1,
          apellido2: client.apellido2,
          telefono: client.telefono,
          estado: client.estado,
        }}
      />

      <ConfirmDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        title="Desactivar cliente"
        description={`¿Seguro que deseas desactivar a ${client.nombre} ${client.apellido1} ${client.apellido2}? Esta acción no se puede deshacer.`}
        confirmText="Desactivar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        loading={deleteCliente.isPending as boolean}
      />
    </>
  )
}

export default CardCliente
