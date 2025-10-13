import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, Home, Printer, UserRound } from "lucide-react";
import { useMemo } from "react";
import { useGetContract } from "../hooks/contractHooks";
import { ContractDetailProps } from "../types/contractTypes";
import { formatDate } from "@/utils/dates";
import { fmtCRC } from "@/utils/moneyFormatter";
import { ContractParticipants } from "../models/contract";

export default function ContenidoDetalleContrato({ contractID }: ContractDetailProps) {
  const { contract: detail, loadingContract, errorContract } = useGetContract(contractID);

  const participantesPorRol = useMemo(() => {
    const grupos: Record<string, Array<{ nombre: string; identificacion: number }>> = {};

    const lista = (detail?.participantes ?? []) as ContractParticipants[];

    for (const p of lista) {
      const key = `${p.rol || "Participante"}`;


      const nombre = [p.nombre, p.apellido1, p.apellido2?.trim() ? p.apellido2 : undefined]
        .filter(Boolean)
        .join(" ");

      (grupos[key] ??= []).push({
        nombre,
        identificacion: p.identificacion,
      });
    }

    return grupos;
  }, [detail?.participantes]);


  if (loadingContract) return <div className="p-6">Cargando contrato…</div>;
  if (errorContract || !detail) return <div className="p-6 text-red-600">No fue posible cargar el contrato.</div>;

  return (
    <div className="max-h-[85vh] overflow-y-auto pr-4
        scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700
         scrollbar-track-gray-100 print:scrollbar-none print:overflow-hidden print:p-0">
    
        <div className="flex h-10 items-center justify-between border-b bg-muted/30 
        rounded-t-lg print:hidden pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <div className="">
              <h2 className="text-lg font-semibold">
              Contrato #{detail.idContrato}
              </h2>
              <p className="text-xs text-muted-foreground">
              {formatDate(detail.fechaFirma)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{detail.estado}</Badge>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </Button>
          </div>
        </div>

        <div className="pt-5 print:px-0 print:py-0">
          <header className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-wide uppercase">CONTRATO DE {detail.tipoContrato}</h1>
            <div className="flex justify-between mt-2 items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Suscrito el {formatDate(detail.fechaFirma)}
              </p>
              <p className="text-sm text-muted-foreground">
                Vigente de {formatDate(detail.fechaInicio)} a {formatDate(detail.fechaFin)}
              </p>
            </div>
          </header>

          <Separator className="my-4" />

          <section className="mb-6">
            <h3 className="text-[11px] tracking-widest font-semibold uppercase flex items-center gap-2">
              <UserRound className="h-4 w-4" /> Partes
            </h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(participantesPorRol).map(([rol, lista]) => (
                <div key={rol} className="rounded-md border p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">{rol}</p>
                  <ul className="space-y-1">
                    {lista.map((p, i) => (
                      <li key={rol + i} className="flex items-center justify-between">
                        <span className="font-medium">{p.nombre}</span>
                        <span className="text-muted-foreground text-xs">Identificacion: {p.identificacion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {Object.keys(participantesPorRol).length === 0 && (
                <div className="text-sm text-muted-foreground">No hay participantes registrados.</div>
              )}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-[11px] tracking-widest font-semibold uppercase flex items-center gap-2">
              <Home className="h-4 w-4" /> Inmueble
            </h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ubicación</span>
              <span className="font-medium text-right">{detail.propiedad.ubicacion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tipo</span>
              <span className="font-medium">{detail.propiedad.nombreTipoInmueble}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estado</span>
                <span className="font-medium">{detail.propiedad.nombreEstadoPropiedad}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Precio de la propiedad</span>
              <span className="font-medium">{fmtCRC(detail.propiedad.precio)}</span>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-[11px] tracking-widest font-semibold uppercase flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Vigencia y Pagos
            </h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fecha de firma</span>
              <span className="font-medium">{formatDate(detail.fechaFirma)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fecha de pago</span>
              <span className="font-medium">{formatDate(detail.fechaPago)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Período</span>
                <span className="font-medium">
                {formatDate(detail.fechaInicio)} — {formatDate(detail.fechaFin)}
                </span>
              </div>
              {detail.deposito && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Depósito</span>
                <span className="font-medium">{fmtCRC(detail.deposito)}</span>
                </div>
              )}
            {detail.porcentajeComision && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">% Comisión</span>
                <span className="font-medium">{detail.porcentajeComision}%</span>
                </div>
              )}
            {detail.montoTotal && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monto total</span>
                  <span className="font-medium">{fmtCRC(detail.montoTotal)}</span>
                </div>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-[11px] tracking-widest font-semibold text-muted-foreground uppercase">
            Condiciones ({detail.condiciones.length})
            </h3>
            <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm leading-6">
              {detail.condiciones.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                detail.condiciones.map((c: any) => (
                  <li key={c.idCondicion}>{c.textoCondicion}</li>
                ))
              ) : (
                <li className="text-muted-foreground">Sin condiciones registradas.</li>
              )}
            </ol>
          </section>

          <Separator className="my-6" />
          <section className="mb-2">
            <h3 className="text-[11px] tracking-widest font-semibold uppercase">
              Firman
            </h3>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(participantesPorRol).flatMap(([rol, lista]) =>
                lista.map((p, i) => (
                  <div key={`${rol}-${i}`} className="flex flex-col items-center">
                    <div className="w-full h-12" />
                    <div className="w-full border-t" />
                    <div className="mt-2 text-center">
                      <p className="font-medium">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {rol} — ID {p.identificacion}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {Object.keys(participantesPorRol).length === 0 && (
                <div className="text-sm text-muted-foreground">No hay participantes para firmar.</div>
              )}
            </div>
          </section>

          <footer className="mt-8 text-[11px] text-muted-foreground text-center">
            Este documento se emite para los fines legales correspondientes.
          </footer>
        </div>
      </div>
  );
}
