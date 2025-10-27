// src/routes/facturacion/index.tsx  (o donde tengas la ruta)
import FacturacionPage from '@/modules/facturacion/components/facturacionPage'
import { createFileRoute } from '@tanstack/react-router'

// ↑ ajusta el path relativo según tu estructura

export const Route = createFileRoute('/facturacion/')({
  component: () => <FacturacionPage />,
})
