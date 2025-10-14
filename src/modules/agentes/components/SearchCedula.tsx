import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useGetAgent } from "../hooks/agentesHooks";
import CardAgente from "./CardAgente";

const SearchCedula =({
  cedula,
  onClear,
}: {
  cedula: string;
  onClear: () => void;
}) => {
  const { agente, loadingAgente, errorAgente } = useGetAgent(cedula);

  if (loadingAgente) {
    return (
      <div className="mb-4 text-sm text-muted-foreground w-full text-center flex items-center justify-center flex-col gap-5">
        <Loader/>
        Buscando agente…
      </div>
    );
  }

  if (errorAgente) {
    return (
    <div className="mb-4 text-sm text-muted-foreground w-full text-center">
        <p className="text-sm">
          No se encontró un agente con la cédula <b>{cedula}</b>.
        </p>
      </div>
    );
  }

  if (!agente) {
    return (
      <div className="mb-4 text-sm text-muted-foreground w-full text-center">
        <p className="text-sm">
          No se encontró un agente con la cédula <b>{cedula}</b>.
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
        <CardAgente key={agente.identificacion} agent={agente} />
      </div>
    </div>
  );
}

export default SearchCedula;