import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/agentes" className="[&.active]:font-bold">
        agentes
      </Link>{' '}
      <Link to="/clientes" className="[&.active]:font-bold">
        clientes
      </Link>{' '}
      <Link to="/contratos" className="[&.active]:font-bold">
        contratos
      </Link>{' '}
      <Link to="/facturacion" className="[&.active]:font-bold">
        facturacion
      </Link>{' '}
      <Link to="/propiedades" className="[&.active]:font-bold">
        propiedades
      </Link>{' '}
      <Link to="/statistics" className="[&.active]:font-bold">
        estadisticas
      </Link>{' '}
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
  )
}