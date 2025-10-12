import CardPreviewContrato from '@/modules/contratos/components/CardPreviewContrato';
import FormCrearContrato from '@/modules/contratos/components/FormCrearContrato';
import { useGetContracts } from '@/modules/contratos/hooks/contractHooks';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contratos/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { contracts, loadingContracts, errorContracts } = useGetContracts();

  if (loadingContracts) return <div>Loading...</div>;
  if (errorContracts) return <div>Error loading contracts</div>;

  return (
      <>

      <section className="m-4">
        <header className="flex items-center justify-between mb-4 ml-16">
          <h1 className="text-4xl font-bold">Contratos</h1>
        </header>

        <nav className="flex flex-wrap gap-4 items-center justify-end mb-4 ml-16">
          <FormCrearContrato />
          <div className="flex gap-4 justify-between items-center">
          </div>
        </nav>

        {(loadingContracts) && (
          <div className="ml-16">Cargando contratos...</div>
        )}
        {errorContracts && <div className="ml-16 text-destructive">Error cargando contratos.</div>}


        <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => {
            return (
              <CardPreviewContrato key={contract.idContrato} contract={contract} />
            )
          })}
        </main>
      </section>
    </>
  )
}
