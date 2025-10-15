import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/animate-ui/components/headless/dialog'
import FormEditarContrato from './FormEditarContrato'
import { FormEditContractProps } from '../types/contractTypes'

export default function DialogEditarContrato({ open, onOpenChange, initial }: FormEditContractProps) {
  return (
    <Dialog open={open} onClose={(v) => onOpenChange(Boolean(v))}>
      <DialogPanel className="max-h-[95vh] rounded-2xl overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-20 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur border-b py-2 px-4">
          <DialogTitle>Editar contrato #{initial.idContrato}</DialogTitle>
          <DialogDescription>Modifica los campos permitidos y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto p-4 pr-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700 scrollbar-track-gray-100">
          <FormEditarContrato
            initial={initial}
            onSuccess={() => onOpenChange(false)} 
          />
        </div>

        <DialogFooter className="border-t px-4 py-3">
          <DialogClose>
            <Button type="button" variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  )
}
