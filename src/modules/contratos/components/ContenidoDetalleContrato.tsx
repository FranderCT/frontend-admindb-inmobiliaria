import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, FileText, UserRound, Home } from 'lucide-react'

function fmt(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

function getEstadoTxt(fi?: string, ff?: string) {
  if (!fi || !ff) return '—'
  const hoy = new Date()
  const ini = new Date(fi)
  const fin = new Date(ff)
  if (hoy < ini) return 'Pendiente'
  if (hoy > fin) return 'Vencido'
  return 'Vigente'
}

type Props = {
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
}

const ContenidoDetalleContrato = ({ contract }: Props) => {
  const estado = getEstadoTxt(contract.fechaInicio, contract.fechaFin)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText size={18} /> Contrato #{contract.idContrato}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{contract.TipoContrato}</p>
        </div>
        <Badge>{estado}</Badge>
      </div>

      <Separator />

      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserRound size={16} /> <span>Agente</span>
          </div>
          <span className="font-medium">{contract.NombreAgente} {contract.ApellidoAgente}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Home size={16} /> <span>Propiedad</span>
          </div>
          <span className="font-medium">{contract.Propiedad}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays size={16} /> <span>Período</span>
          </div>
          <span className="font-medium">{fmt(contract.fechaInicio)} — {fmt(contract.fechaFin)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Fecha de firma</span>
          <span className="font-medium">{fmt(contract.fechaFirma)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Fecha de pago</span>
          <span className="font-medium">{fmt(contract.fechaPago)}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Condiciones ({contract.condiciones?.length ?? 0})</h3>
        <ul className="list-disc pl-5 space-y-1">
          {(contract.condiciones ?? []).map(c => (
            <li key={c.idCondicion} className="text-sm leading-5">{c.textoCondicion}</li>
          ))}
          {(!contract.condiciones || contract.condiciones.length === 0) && (
            <li className="text-sm text-muted-foreground">Sin condiciones registradas</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ContenidoDetalleContrato
