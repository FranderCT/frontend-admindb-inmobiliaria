import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facturacion/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/facturacion/"!</div>
}
