import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contratos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/contratos/"!</div>
}
