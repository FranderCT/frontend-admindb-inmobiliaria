import CardUser from '@/modules/seguridad/components/CardUser';
import FormRegister from '@/modules/seguridad/components/FormRegister';
import { useGetUsers } from '@/modules/seguridad/hooks/usuariosHooks';
import { protectRoute } from '@/modules/seguridad/utils/authGuard';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/configuracion/usuarios')({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, [ 'ADMINISTRADOR'])
  },
  
  component: RouteComponent,
})

function RouteComponent() {
  const { users, loadingUsers, errorUsers } = useGetUsers(1,1 ,true);
  return (<section className="m-4">
    <header className="flex items-center justify-between mb-4 ml-16">
      <h1 className="text-4xl font-bold">Gestionar usuarios</h1>
      <nav>
        <FormRegister/>
      </nav>
    </header>

    <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loadingUsers && <p>Cargando usuarios...</p>}
      {errorUsers && <p>Error al cargar usuarios: {errorUsers.message}</p>}
      {users && users.map(user => (
        <CardUser key={user.idUsuario} user={user} />
      ))}
    </main>
  </section>
  );
}
