import { protectRoute } from '@/modules/seguridad/utils/authGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facturacion/')({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['AGENTE', 'ADMINISTRADOR', 'LECTOR'])
  },

  component: RouteComponent,
})
