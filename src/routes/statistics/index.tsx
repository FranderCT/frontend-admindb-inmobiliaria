
import { protectRoute } from '@/modules/seguridad/utils/authGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/statistics/')({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['ADMINISTRADOR', 'LECTOR'])
  },

  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/statistics/"!</div>
}
