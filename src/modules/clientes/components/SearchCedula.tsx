import { Button } from "@/components/ui/button";
import { useGetCliente } from "../hooks/clientesHooks";
import CardCliente from "./CardCliente";
import { Loader } from "lucide-react";

const SearchCedula =({
  cedula,
  onClear,
}: {
  cedula: string;
  onClear: () => void;
}) => {
  const { cliente, loadingCliente, errorCliente } = useGetCliente(cedula);

  if (loadingCliente) {
    return (
      <div className="mb-4 text-sm text-muted-foreground w-full text-center flex items-center justify-center flex-col gap-5">
        <Loader/>
        Buscando cliente…
      </div>
    );
  }

  if (errorCliente) {
    return (
    <div className="mb-4 text-sm text-muted-foreground w-full text-center">
        <p className="text-sm">
          No se encontró un cliente con la cédula <b>{cedula}</b>.
        </p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="mb-4 text-sm text-muted-foreground w-full text-center">
        <p className="text-sm">
          No se encontró un cliente con la cédula <b>{cedula}</b>.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Resultado</h2>
        <Button variant="outline" size="sm" onClick={onClear}>
          Limpiar búsqueda
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardCliente key={cliente.identificacion} client={cliente} />
      </div>
    </div>
  );
}

export default SearchCedula;