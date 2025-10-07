import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'
import { DialogClienteProps } from '../types/clientTypes'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const DialogDetalleCliente = ({from = 'bottom', trigger, client}: DialogClienteProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent from={from}>
        <div className="absolute right-3 top-3">
          <AlertDialogCancel asChild>
            <Button variant="ghost" size="icon">
              <X />
            </Button>
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader className="mb-2 pr-10">
          <AlertDialogTitle className="text-lg">
            Historial del cliente
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 text-sm">
          <section className="space-y-1">
            <h3 className="font-semibold">{client.name} {client.lastname1} {client.lastname2}</h3>
            <p className="text-muted-foreground">{client.id}</p>
            <p className="text-muted-foreground">{client.phone}</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold">Historial de contratos</h3>

            <div className="space-y-1">
              <p className="font-semibold">Contrato 1</p>
              <p className="text-muted-foreground">Propiedades asociadas al contrato</p>
              <p className="text-muted-foreground">Rol en el contrato</p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold">Contrato 2</p>
              <p className="text-muted-foreground">Propiedades asociadas al contrato</p>
              <p className="text-muted-foreground">Rol en el contrato</p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold">Contrato 3</p>
              <p className="text-muted-foreground">Propiedades asociadas al contrato</p>
              <p className="text-muted-foreground">Rol en el contrato</p>
            </div>
          </section>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cerrar</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DialogDetalleCliente