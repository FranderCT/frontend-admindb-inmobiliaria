import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, IdCard, Phone, Home } from 'lucide-react'
import type { ClientCardProps } from '../types/clientTypes'
import DialogDetalleCliente from './DialogDetalleCliente'

const CardCliente = ({ client }: ClientCardProps) => {
  const fullName = `${client.name} ${client.lastname1} ${client.lastname2}`.trim()
  const cantProps = 0;

  const renderEstado = (status: boolean) =>
    status ? <Badge>Activo</Badge> : <Badge variant="outline">Inactivo</Badge>

    const CardTrigger = <Card key={client.id} className="hover:shadow-md transition-shadow hover:cursor-pointer">
        <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-base">{fullName}</CardTitle>
                </div>
                {renderEstado(client.status)}
            </div>
        </CardHeader>

        <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <IdCard className="h-4 w-4" />
                    <span>Cédula</span>
                </div>
                <span className="font-medium">{client.id}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Contacto</span>
                </div>
                <span className="font-medium">{client.phone}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span>Cant Propiedades</span>
                </div>
                <span className="font-medium">{cantProps}</span>
            </div>

            <div className="flex items-center justify-between pt-3 mt-1 border-t">
                <div className="text-sm text-muted-foreground">Acciones</div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" aria-label="Editar">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        aria-label="Eliminar"
                    >
                        <Trash2 className="h-4 w-4" />
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
