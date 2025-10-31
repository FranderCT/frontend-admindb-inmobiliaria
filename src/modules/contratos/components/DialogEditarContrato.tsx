import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/animate-ui/components/headless/dialog'
import {
  Tabs,
  TabsPanel,
  TabsPanels,
  TabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs';
import FormEditarContrato from './FormEditarContrato'
import { FormEditContractProps } from '../types/contractTypes'
import FormGestionParticipantesContrato from './FormGestionParticipantesContrato';

export default function DialogEditarContrato({ open, onOpenChange, initial }: FormEditContractProps) {
  return (
    <Dialog open={open} onClose={(v) => onOpenChange(Boolean(v))}>
      <DialogPanel className="max-h-[97vh] rounded-2xl overflow-hidden p-0">
        <DialogHeader className=" sticky top-0 z-20 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur border-b py-2 px-4">
          <DialogTitle className="pt-2">Editar contrato #{initial.idContrato}</DialogTitle>
          <DialogDescription>Modifica los campos permitidos y guarda los cambios.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="editar">
          <TabsList className="w-full flex">
            <TabsTab value="editar">Editar contrato</TabsTab>
            <TabsTab  value="participantes">Participantes</TabsTab>
          </TabsList>
          <TabsPanels>
            <TabsPanel value="editar" className="flex flex-col gap-6 mb-6">
              <div className="max-h-[80vh] overflow-y-auto p-4 pr-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700 scrollbar-track-gray-100 mb-4">
                <FormEditarContrato
                  initialIdContrato={initial.idContrato}
                  onSuccess={() => onOpenChange(false)}
                />
              </div>
            </TabsPanel>
            <TabsPanel value="participantes" className="flex flex-col gap-6">
              <div className="max-h-[80vh] overflow-y-auto p-4 pr-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700 scrollbar-track-gray-100">
                <FormGestionParticipantesContrato
                  idContrato={initial.idContrato}
                  onSuccess={() => {
                    onOpenChange(false)
                  
                  }}
                  onCancel={() => {
                    onOpenChange(false)
                  
                  }}
                />
              </div>
            </TabsPanel>
          </TabsPanels>
        </Tabs>
      </DialogPanel>
    </Dialog>
  )
}
