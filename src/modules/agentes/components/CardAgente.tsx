import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, IdCard, Phone, DollarSign } from 'lucide-react'
import { AgentCardProps } from '../types/agentTypes'
import DialogDetalleAgente from './DialogDetalleAgente'

const CardAgente = ({ agent }: AgentCardProps) => {
  const fullName = `${agent.name} ${agent.lastname1} ${agent.lastname2}`.trim()

  // Formatear comisión como moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const renderEstado = (status: boolean) =>
    status ? <Badge>Activo</Badge> : <Badge variant="outline">Inactivo</Badge>

  const CardTrigger = <Card key={agent.id} className="hover:shadow-md transition-shadow hover:cursor-pointer">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base font-semibold">{fullName}</CardTitle>
        </div>
        {renderEstado(agent.status)}
      </div>
    </CardHeader>

    <CardContent className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IdCard size={19} />
          <span>Identificación: </span>
        </div>
        <span className="font-medium">{agent.id}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={17} />
          <span>Contacto: </span>
        </div>
        <span className="font-medium">{agent.phone}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign size={17} />
          <span>Comisión Acumulada: </span>
        </div>
        <span className="font-medium">{formatCurrency(agent.accumulatedcommission)}</span>
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
            <Trash2 />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  return (
    <DialogDetalleAgente from="bottom" trigger={CardTrigger} agent={agent}/>
  )
}

export default CardAgente