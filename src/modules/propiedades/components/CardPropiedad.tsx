import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, DollarSign, Home, MapPin, Trash2, CircleUser } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PropiedadCardProps } from '../types/propiedadTypes'
import { formatPrice } from '../utils/formatters'
import FormEditPropiedad from './FormEditPropiedad'
import { useDeleteProperty } from '../hooks/propiedadesHook'
import ConfirmDialog from '@/modules/clientes/components/ConfirmDialog'

const CardPropiedad = ({ property, estadosPropiedad = [], tiposInmueble = [] }: PropiedadCardProps) => {
  const deleteProp = useDeleteProperty()
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenConfirmDelete(true)
  }

  const handleConfirmDelete = async () => {
    await deleteProp.mutateAsync(property.idPropiedad)
  }

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpenEdit(true)
  }

  return (
    <>
      <Card key={property.idPropiedad} className="hover:shadow-md transition-shadow hover:cursor-default">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg line-clamp-2">{property.ubicacion}</CardTitle>
              <CardDescription className="font-mono text-xs">{property.idPropiedad}</CardDescription>
            </div>
            <Badge>{property.estadoPropiedad.nombre}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> Ubicación:
            </div>

            <span className="truncate font-semibold">{property.ubicacion}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" /> Precio:
            </div>
            <span className="truncate font-semibold">{formatPrice(property.precio, 'CRC')}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4 " /> Tipo de inmueble:
            </div>
            <span className="truncate font-semibold">{property.tipoInmueble.nombre}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CircleUser className="h-4 w-4 text-muted-foreground" /> Propietario:
            </div>
            <span className="truncate font-semibold">
              {property.cliente.nombre} {property.cliente.apellido1} {property.cliente.apellido2}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-sm text-muted-foreground">Acciones</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" aria-label="Editar" onClick={onEditClick}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                aria-label="Eliminar"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal editar */}
      <FormEditPropiedad
        open={openEdit}
        onOpenChange={setOpenEdit}
        property={property}
        estadosPropiedad={estadosPropiedad}
        tiposInmueble={tiposInmueble}
      />

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        title="Eliminar propiedad"
        description={`¿Seguro que deseas eliminar la propiedad #${property.idPropiedad} en ${property.ubicacion}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        loading={deleteProp.isPending as boolean}
      />
    </>
  )
}

export default CardPropiedad
