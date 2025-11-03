import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { HistorialClienteProps } from '../types/clientTypes'
import ContenidoHistorialCliente from './ContenidoHistorialCliente'

const DialogDetalleCliente = ({ from = 'bottom', trigger, client, identificacion }: HistorialClienteProps) => {
  const clienteNombre = "" + client.nombre + " " + client.apellido1 + " " + (client.apellido2 || '') ;
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

        <ContenidoHistorialCliente clienteNombre={clienteNombre} telefono={client.telefono} identificacion={identificacion} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogDetalleCliente

