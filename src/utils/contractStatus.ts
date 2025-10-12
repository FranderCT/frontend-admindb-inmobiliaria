export function getEstado(fechaInicio?: string, fechaFin?: string) {
    if (!fechaInicio || !fechaFin) return { text: '—', variant: 'outline' as const }
    const hoy = new Date()
    const ini = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    if (hoy < ini) return { text: 'Pendiente', variant: 'outline' as const }
    if (hoy > fin) return { text: 'Vencido', variant: 'destructive' as const }
    return { text: 'Vigente', variant: 'default' as const }
}