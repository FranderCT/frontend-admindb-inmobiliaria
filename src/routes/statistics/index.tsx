import { protectRoute } from '@/modules/seguridad/utils/authGuard'
import { createFileRoute } from '@tanstack/react-router'
import {
  Tabs,
  TabsPanel,
  TabsPanels,
  TabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import { PanelAgentes } from '@/modules/estadisticas/components/PanelAgentes'
import PanelContratos from '@/modules/estadisticas/components/PanelContratos'
import PanelFinanciero from '@/modules/estadisticas/components/PanelFinanciero'
import { PanelPropiedades } from '@/modules/estadisticas/components/PanelPropiedades'
import { PanelClientes } from '@/modules/estadisticas/components/PanelClientes'
import PanelGeneral from '@/modules/estadisticas/components/PanelGeneral'

export const Route = createFileRoute('/statistics/')({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['ADMINISTRADOR', 'LECTOR'])
  },
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="ml-5 mt-15">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full flex flex-wrap gap-2">
          <TabsTab value="general">General</TabsTab>
          <TabsTab value="financiero">Financiero</TabsTab>
          <TabsTab value="contratos">Contratos</TabsTab>
          <TabsTab value="operaciones">Operaciones</TabsTab>
          <TabsTab value="propiedades">Propiedades</TabsTab>
          <TabsTab value="clientes">Clientes</TabsTab>
        </TabsList>

        <TabsPanels>
          <TabsPanel value="general" className="w-full">
            <PanelGeneral/>
          </TabsPanel>

          <TabsPanel value="financiero" className="w-full space-y-10">
            <PanelFinanciero/>
          </TabsPanel>

          <TabsPanel value="contratos" className="w-full space-y-10">
            <PanelContratos/>
          </TabsPanel>
          
          <TabsPanel value="operaciones" className="w-full">
            <PanelAgentes />
          </TabsPanel>
          <TabsPanel value="propiedades" className="w-full">
            <PanelPropiedades />
          </TabsPanel>

          <TabsPanel value="clientes" className="w-full">
            <PanelClientes />
          </TabsPanel>
        </TabsPanels>
      </Tabs>
    </div>
  )
}
