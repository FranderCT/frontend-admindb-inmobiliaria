import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/agentes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/agentes/"!</div>
}
