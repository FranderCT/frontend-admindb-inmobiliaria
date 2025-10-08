import CardCliente from '@/modules/clientes/components/CardCliente'
import FormAgregarCliente from '@/modules/clientes/components/FormAgregarCliente'
import { useGetClientes } from '@/modules/clientes/hooks/clientesHooks';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/clientes/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {clientes, loadingClientes} = useGetClientes()

  if (loadingClientes) return <div>Cargando clientes...</div>

  return <section className='m-4'>
    <nav className=' flex items-center justify-between mb-4 ml-15'>
      <h1 className='text-4xl font-bold'>Clientes</h1>
      <FormAgregarCliente />
    </nav>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clientes.map((client) => (
        <CardCliente key={client.identificacion} client={client} />
      ))}
    </div>
  </section>
}
