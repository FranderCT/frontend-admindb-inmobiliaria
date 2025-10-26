import TileCard from '@/components/TileCard';
import { protectRoute } from '@/modules/seguridad/utils/authGuard';
import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react';

export const Route = createFileRoute('/configuracion/')({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, ['ADMINISTRADOR'])
  },

  component: RouteComponent,
})

function RouteComponent() {
  return (<section className="m-4">
    <header className="flex items-center justify-between mb-4 ml-16">
      <h1 className="text-4xl font-bold">Configuración</h1>
    </header>

    <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <TileCard icon={<User />} title='Usuarios' desc='Gestión de usuarios' to='usuarios' />
    </main>
  </section>
  );
}
