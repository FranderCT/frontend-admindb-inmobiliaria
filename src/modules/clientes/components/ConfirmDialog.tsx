import {
    Dialog,
    DialogPanel,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/animate-ui/components/headless/dialog";
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ConfirmDialogProps } from "../types/clientTypes";

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  from = 'bottom',
  showCloseButton = true,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false)
    
  const handleConfirm = async () => {
    try {
      setSubmitting(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)}>
      <DialogPanel
        from={from}
        showCloseButton={showCloseButton}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter>
          <Button onClick={handleConfirm} disabled={submitting || loading}>
            {submitting || loading ? 'Procesando...' : confirmText}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  )
}
