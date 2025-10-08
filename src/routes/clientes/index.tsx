import { Button } from '@/components/ui/button'
import CardCliente from '@/modules/clientes/components/CardCliente'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/clientes/')({
  component: RouteComponent,
})

 const mockClients = [
  {
    id: 101230456,
    name: "María",
    lastname1: "González",
    lastname2: "Rodríguez",
    phone: "+506 8888-1234",
    status: true,
  },
  {
    id: 208760912,
    name: "Carlos",
    lastname1: "Jiménez",
    lastname2: "Mora",
    phone: "+506 7777-5678",
    status: true,
  },
  {
    id: 304589771,
    name: "Ana",
    lastname1: "Vargas",
    lastname2: "Solís",
    phone: "+506 6666-9012",
    status: false,
  },
  {
    id: 405671223,
    name: "Luis",
    lastname1: "Castro",
    lastname2: "Araya",
    phone: "+506 6030-5566",
    status: true,
  },
  {
    id: 509812334,
    name: "Gabriela",
    lastname1: "Hernández",
    lastname2: "Alfaro",
    phone: "+506 7012-8899",
    status: true,
  },
];

function RouteComponent() {

  return <section className='m-4'>
    <nav className=' flex items-center justify-between mb-4 ml-15'>
      <h1 className='text-4xl font-bold'>Clientes</h1>
      <Button>
        <Plus /> Agregar Cliente
      </Button>
    </nav>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockClients.map((client) => (
        <CardCliente key={client.id} client={client} />
      ))}
    </div>
  </section>
}
