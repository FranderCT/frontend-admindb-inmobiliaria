import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/propiedades/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/propiedades/"!
    <h1>hola</h1>
  </div>
}
