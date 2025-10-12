import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Edit, CalendarDays, FileText, BriefcaseBusiness, LandPlot, Signature } from 'lucide-react'
import type { CardContractProps } from '../types/contractTypes'
import DialogDetalleContrato from './DialogDetalleContrato'
import { getEstado } from '@/utils/contractStatus'
import { formatDate } from '@/utils/dates'

const CardPreviewContrato = ({ contract, onEdit }: CardContractProps) => {
    const [open, setOpen] = useState(false)

    const estado = useMemo(() => getEstado(contract.fechaInicio, contract.fechaFin), [contract.fechaInicio, contract.fechaFin])

    const Trigger = (
        <Card
            className="hover:shadow-md transition-shadow hover:cursor-pointer"
            onClick={() => setOpen(true)}
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
                        <Signature className="h-4 w-4" />Firmado en: 
                    </div>
                    <b className="text-foreground">{formatDate(contract.fechaFirma)}</b>
                </div>


                <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground flex gap-2 items-center">
                        <CalendarDays className="h-4 w-4" />Fecha de pago:
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
                                e.stopPropagation()
                                onEdit?.()
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
        <DialogDetalleContrato
            from="bottom"
            open={open}
            onOpenChange={setOpen}
            trigger={Trigger}
            contract={contract}
        />
    )
}

export default CardPreviewContrato
