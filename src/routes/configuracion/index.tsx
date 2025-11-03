
import { Badge } from '@/components/ui/badge';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef, CellContext } from '@tanstack/react-table';
import { useState } from 'react';
import FormRegister from '@/modules/seguridad/components/FormRegister';
import { useGetUsers } from '@/modules/seguridad/hooks/usuariosHooks';
import type { User } from '@/modules/seguridad/models/usuario';
import DataTable from '@/modules/seguridad/components/UsersTable';
import { protectRoute } from '@/modules/seguridad/utils/authGuard';
import ActionsCell from '@/modules/seguridad/components/AccionesCell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Skeleton from '@mui/material/Skeleton';

export const Route = createFileRoute('/configuracion/')({
  beforeLoad: ({ location }) => {
    protectRoute(location.pathname, [ 'ADMINISTRADOR'])
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [estado, setEstado] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState(0); 
  const [pageSize, setPageSize] = useState(10);
  const { loadingUsers, errorUsers, usersResponse } =
    useGetUsers(pageIndex + 1, pageSize, estado);


  const columns: ColumnDef<User>[] = [
    {
      header: "Nombre completo",
      id: "nombreCompleto",
      cell: ({ row }) => {
        const u = row.original;
        return `${u.nombre} ${u.apellido1}${u.apellido2 ? " " + u.apellido2 : ""}`;
      },
    },
    { header: "Correo", accessorKey: "email" },
    { header: "Rol", accessorKey: "rolUsuario.nombre" },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: (props: CellContext<User, unknown>) => {
        const activo = Boolean(props.getValue());
        return <Badge variant={activo ? "default" : "secondary"}>{activo ? "Activo" : "Inactivo"}</Badge>;
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <ActionsCell user={row.original} />,
    },
  ];

  return (
    <section className="lg:m-5">
      <header className="flex justify-between gap-4">
        <header className="flex items-center justify-between mb-4 ml-16">
          <h1 className="text-4xl font-bold">Usuarios del sistema</h1>
        </header>
        <nav className="flex gap-4">
            <FormRegister />
        </nav>
      </header>
      <main className="mx-4">
        {loadingUsers &&
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
              <Card key={k} className="h-[300px] w-70">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent className="px-2 pb-6">
                  <Skeleton className="h-[190px] w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>}
        {errorUsers && <p>Error al cargar usuarios: {(errorUsers as Error).message}</p>}

        <DataTable<User, unknown>
          columns={columns}
          data={usersResponse.data}
          total={usersResponse.meta.total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          estado={estado}
          setEstado={setEstado}
        />
      </main>
    </section>
  );
}
