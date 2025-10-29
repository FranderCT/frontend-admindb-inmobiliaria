// components/Users/ActionsCell.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, Loader2 } from "lucide-react";
import type { User } from "@/modules/seguridad/models/usuario";
import { useDeactivateUser } from "@/modules/seguridad/hooks/usuariosHooks"; // tu hook
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/animate-ui/components/radix/alert-dialog";

type Props = { user: User };

export default function ActionsCell({ user }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useDeactivateUser();

  const inactive = !user.estado;

  const onConfirm = async () => {
    try {
      await mutateAsync(user.idUsuario);
      toast.success(`Usuario #${user.idUsuario} desactivado`);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo desactivar el usuario");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <span
          onClick={(e) => e.stopPropagation()} // no disparar onRowClick
        >
          <Button
            variant={inactive ? "secondary" : "destructive"}
            size="sm"
            disabled={inactive || isPending}
            className="gap-1"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            Desactivar
          </Button>
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que deseas desactivar al usuario <b>#{user.idUsuario}</b>? Podrás reactivarlo más tarde.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
