import { Button } from '@/components/ui/button'
import DialogAgregarAgente from '@/modules/agentes/components/AgregarAgente';
import CardAgente from '@/modules/agentes/components/CardAgente';

import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/agentes/')({
  component: RouteComponent,
})

const mockClients = [
  {
    id: 101230456,
    name: "María",
    lastname1: "González",
    lastname2: "Rodríguez",
    phone: "+506 8888-1234",
    accumulatedcommission: 150000,
    status: true,
  },
  {
    id: 208760912,
    name: "Carlos",
    lastname1: "Jiménez",
    lastname2: "Mora",
    phone: "+506 7777-5678",
    accumulatedcommission: 225000,
    status: true,
  },
  {
    id: 304589771,
    name: "Ana",
    lastname1: "Vargas",
    lastname2: "Solís",
    phone: "+506 6666-9012",
    accumulatedcommission: 180000,
    status: false,
  },
  {
    id: 405671223,
    name: "Luis",
    lastname1: "Castro",
    lastname2: "Araya",
    phone: "+506 6030-5566",
    accumulatedcommission: 320000,
    status: true,
  },
  {
    id: 509812334,
    name: "Gabriela",
    lastname1: "Hernández",
    lastname2: "Alfaro",
    phone: "+506 7012-8899",
    accumulatedcommission: 275000,
    status: true,
  },
];

function RouteComponent() {
  // TODO: Aquí irá la llamada al backend para obtener los agentes
  // const { data: agentes } = useQuery(['agentes'], fetchAgentes)

  const handleAgregarAgente = (nuevoAgente: any) => {
    // TODO: Aquí irá la llamada al backend para crear un agente
    // await createAgente(nuevoAgente)
    console.log('Agente a crear:', nuevoAgente)
  }

  return <section className='m-4'>
    <nav className='flex items-center justify-between mb-4 ml-15'>
      <h1 className='text-4xl font-bold'>Agentes</h1>
      <DialogAgregarAgente 
        trigger={
          <Button>
            <Plus /> Agregar Agente
          </Button>
        }
        onAgregarAgente={handleAgregarAgente}
      />
    </nav>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockClients.map((agent) => (
        <CardAgente key={agent.id} agent={agent} />
      ))}
    </div>
  </section>
}