import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import ContenidoDetalleContrato from './ContenidoDetalleContrato'

type Props = {
  from?: 'bottom' | 'right' | 'left' | 'top'
  trigger: React.ReactNode
  contract: {
    idContrato: number
    fechaInicio?: string
    fechaFin?: string
    fechaFirma?: string
    fechaPago?: string
    TipoContrato?: string
    Propiedad?: string
    NombreAgente?: string
    ApellidoAgente?: string
    condiciones?: Array<{ idCondicion: number; textoCondicion: string }>
  }
  open?: boolean
  onOpenChange?: (v: boolean) => void
}

const DialogDetalleContrato = ({ from = 'bottom', trigger, contract, open, onOpenChange }: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent from={from}>
        <div className="absolute right-3 top-3">
          <AlertDialogCancel asChild>
            <Button variant="ghost" size="icon" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogCancel>
        </div>

        <ContenidoDetalleContrato contract={contract} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogDetalleContrato
