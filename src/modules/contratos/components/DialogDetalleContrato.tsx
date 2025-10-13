import { Dialog, DialogTrigger, DialogContent } from "@/components/animate-ui/components/radix/dialog";
import ContenidoDetalleContrato from "./ContenidoDetalleContrato";
import { DialogContractDetailProps } from "../types/contractTypes";

const DialogDetalleContrato = ({ trigger, idContrato, open, onOpenChange }: DialogContractDetailProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ContenidoDetalleContrato contractID={idContrato} />
      </DialogContent>
    </Dialog>
  )
}

export default DialogDetalleContrato
