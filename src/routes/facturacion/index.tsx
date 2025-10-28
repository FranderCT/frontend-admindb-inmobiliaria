
import FacturacionPage from '@/modules/facturacion/components/facturacionPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facturacion/')({
  component: () => <FacturacionPage />,
})
