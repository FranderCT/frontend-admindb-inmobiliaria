import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import ContenidoHistorial from './ContenidoHistorial'
import { HistorialAgenteProps } from '../types/agentTypes'

const DialogDetalleAgente = ({ from = 'bottom', trigger, agent, identificacion }: HistorialAgenteProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent from={from}>
        <div className="absolute right-3 top-3">
          <AlertDialogCancel asChild>
            <Button variant="ghost" size="icon" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogCancel>
        </div>

        <ContenidoHistorial agenteNombre={agent.nombre} telefono={agent.telefono} identificacion={identificacion} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogDetalleAgente

