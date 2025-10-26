import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import App from '@/App'
import { protectRoute } from '@/modules/seguridad/utils/authGuard'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (location.pathname !== '/login') protectRoute(location.pathname)
  },
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const hideSidebar = pathname === '/login'
  return (
    <App hideSidebar={hideSidebar}>
      <Outlet />
    </App>
  )
}
