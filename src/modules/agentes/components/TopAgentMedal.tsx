// src/modules/agentes/components/TopAgentMedal.tsx
import { Award, Crown, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

type TopAgentMedalProps = {
  name: string
  commissionsCRC: string // ya formateado
  contracts: number
  subtitle?: string // ej: "Mejor agente de Noviembre 2025"
}

export default function TopAgentMedal({
  name,
  commissionsCRC,
  contracts,
  subtitle = defaultSubtitle(),
}: TopAgentMedalProps) {
  return (
    <Card className="relative overflow-hidden p-4 md:p-6">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-amber-200/50 via-amber-300/30 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-200/40 via-orange-200/30 to-transparent blur-2xl" />

      {/* Encabezado */}
      <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wide">
        <Crown className="h-4 w-4" />
        {subtitle}
      </div>

      <div className="mt-3 flex items-center gap-4">
        {/* Medalla */}
        <div className="relative">
          {/* cinta */}
          <div className="mx-auto h-6 w-10 -mb-1 rounded-b-md bg-gradient-to-b from-amber-500 to-amber-700 shadow-sm" />
          {/* medalla */}
          <div className="grid place-items-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-300 shadow-lg ring-2 ring-amber-500/50">
            <Award className="h-8 w-8 text-amber-700" />
          </div>
          {/* estrella decorativa */}
          <Star className="absolute -right-1 -top-1 h-4 w-4 text-amber-500" />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="truncate text-xl md:text-2xl font-bold leading-tight">
            {name || "—"}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Comisiones: <span className="font-medium text-amber-700">{commissionsCRC}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {contracts} {contracts === 1 ? "contrato" : "contratos"}
          </div>
        </div>
      </div>
    </Card>
  )
}

function defaultSubtitle() {
  const date = new Date()
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  return `Mejor agente de ${meses[date.getMonth()]} ${date.getFullYear()}`
}
