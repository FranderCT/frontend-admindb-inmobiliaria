import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, IdCard, Phone } from 'lucide-react'
import type { ClientCardProps } from '../types/clientTypes'
import DialogDetalleCliente from './DialogDetalleCliente'

const CardCliente = ({ client }: ClientCardProps) => {

  const renderEstado = (status: boolean) =>
    status ? <Badge>Activo</Badge> : <Badge variant="outline">Inactivo</Badge>

    const CardTrigger = <Card key={client.identificacion} className="hover:shadow-md transition-shadow hover:cursor-pointer">
        <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-base font-semibold">{client.nombreCompleto}</CardTitle>
                </div>
                {renderEstado(client.estado)}
            </div>
        </CardHeader>

        <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <IdCard size={19} />
                    <span>Identificación: </span>
                </div>
                <span className="font-medium">{client.identificacion}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={17} />
                    <span>Contacto: </span>
                </div>
                <span className="font-medium">{client.telefono}</span>
            </div>

            <div className="flex items-center justify-between pt-3 mt-1 border-t">
                <div className="text-sm text-muted-foreground">Acciones</div>
                <div className="flex gap-1">
                    <Button variant="ghost" aria-label="Editar">
                        <Edit size={18} />
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        aria-label="Eliminar"
                    >
                        <Trash2  />
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
    return (
        <DialogDetalleCliente from="bottom" trigger={CardTrigger} client={client}/>
    )
}

export default CardCliente
