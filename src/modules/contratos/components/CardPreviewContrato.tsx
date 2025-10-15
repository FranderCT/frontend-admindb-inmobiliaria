import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Edit, CalendarDays, FileText, BriefcaseBusiness, LandPlot, Signature, MapPin } from 'lucide-react'
import type { CardContractProps } from '../types/contractTypes'
import DialogDetalleContrato from './DialogDetalleContrato'
import { getEstado } from '@/utils/contractStatus'
import { formatDate } from '@/utils/dates'
import DialogEditarContrato from './DialogEditarContrato'

const CardPreviewContrato = ({ contract }: CardContractProps) => {
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const estado = useMemo(
    () => getEstado(contract.fechaInicio, contract.fechaFin),
    [contract.fechaInicio, contract.fechaFin]
  )

  const Trigger = (
    <Card
      className="hover:shadow-md transition-shadow hover:cursor-pointer"
      onClick={() => setOpenDetalle(true)}
      data-trigger="contrato"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{contract.idContrato}</CardTitle>
            <CardDescription className="text-sm flex items-center gap-1">
              <FileText size={15} /> {contract.TipoContrato}
            </CardDescription>
          </div>
          <Badge variant={estado.variant}>{estado.text}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground flex gap-2 items-center">
            <LandPlot className="h-4 w-4" /> Propiedad:
          </div>
          <span className="font-medium">{contract.idPropiedad}</span>
        </div>

        <div className="flex items-center justify-between text-sm ml-10">
          <div className="text-muted-foreground flex gap-2 items-center">
            <MapPin className="h-4 w-4" /> Ubicación:
          </div>
          <span className="font-medium">{contract.Propiedad}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays size={16} />
            Período:
          </div>
          <span className="font-medium">
            {formatDate(contract.fechaInicio)} — {formatDate(contract.fechaFin)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground flex gap-2 items-center">
            <BriefcaseBusiness className="h-4 w-4" /> Agente:
          </div>
          <span className="font-medium">{contract.NombreAgente} {contract.ApellidoAgente}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground flex gap-2 items-center">
            <Signature className="h-4 w-4" /> Firmado en:
          </div>
          <b className="text-foreground">{formatDate(contract.fechaFirma)}</b>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground flex gap-2 items-center">
            <CalendarDays className="h-4 w-4" /> Fecha de pago:
          </div>
          <b className="text-foreground">{formatDate(contract.fechaPago)}</b>
        </div>

        <div className="flex items-center justify-between pt-3 mt-1 border-t">
          <div className="text-sm text-muted-foreground">Acciones</div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              aria-label="Editar"
              onClick={(e) => {
                e.stopPropagation() // 👈 evita abrir el detalle
                e.preventDefault()
                setOpenEdit(true)   // 👈 abre el diálogo de edición
              }}
            >
              <Edit size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <DialogDetalleContrato
        open={openDetalle}
        onOpenChange={setOpenDetalle}
        trigger={Trigger}
        idContrato={contract.idContrato}
      />
      <DialogEditarContrato
        open={openEdit}
        onOpenChange={setOpenEdit}
        initial={{
          idContrato: contract.idContrato,
          fechaInicio: contract.fechaInicio?.slice(0, 10),
          fechaFin: contract.fechaFin?.slice(0, 10),
          fechaFirma: contract.fechaFirma?.slice(0, 10),
          fechaPago: contract.fechaPago?.slice(0, 10),
          idTipoContrato: contract.idTipoContrato, 
          idPropiedad: contract.idPropiedad,
          idAgente: contract.idAgente,
          condiciones: contract.condiciones?.map((c) => c.textoCondicion),
        }}
      />
    </>
  )
}

export default CardPreviewContrato
