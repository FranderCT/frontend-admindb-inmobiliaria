import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Ruler, MapPin, BedDouble, Bath } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropiedadCardProps } from "../types/propiedadTypes";
import { formatPrice } from "../utils/formatters";
import FormEditPropiedad from "./FormEditPropiedad";
import { useDeleteProperty } from "../hooks/propiedadesHook";
import ConfirmDialog from "@/modules/clientes/components/ConfirmDialog";
import { estadoPropiedadVariant } from "@/utils/statusVariants";
import { Can } from "@/modules/seguridad/components/Can";
import { capitalize } from "@/utils/capitalize";

const placeholder =
  "https://images.adsttc.com/media/images/623c/4fa0/3e4b/3145/3000/001b/newsletter/_d_ambrosio_07._copy.jpg?1648119692";

interface CardPropiedadExtendedProps extends PropiedadCardProps {
  onClick?: () => void;
}

const CardPropiedad = ({ property, estadosPropiedad = [], tiposInmueble = [], onClick }: CardPropiedadExtendedProps) => {
  const deleteProp = useDeleteProperty();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    await deleteProp.mutateAsync(property.idPropiedad);
  };

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenEdit(true);
  };

  const estadoNombre = String(property.estadoPropiedad?.nombre ?? "").trim();
  const isLocked = /^(Vendido|Reservado)$/i.test(estadoNombre);

  const imagenUrl = property.imagenUrl || placeholder;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="relative overflow-hidden rounded-2xl hover:shadow-md transition-shadow
                 grid grid-cols-[180px_1fr] w-full p-0 cursor-pointer"
      onClick={handleCardClick}
    >
      {property.estadoPropiedad?.nombre && (
        <div className="absolute right-3 top-3 z-10">
          <Badge
            variant={estadoPropiedadVariant[property.estadoPropiedad.nombre]}
            className="rounded-full px-2 py-0.5 text-xs"
          >
            {capitalize(property.estadoPropiedad.nombre)}
          </Badge>
        </div>
      )}

      <div className="p-3 pr-0">
        <div className="w-full h-full">
          <img
            src={imagenUrl}
            alt={property.ubicacion ?? "Propiedad"}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="relative flex flex-col justify-between py-3 min-h-[180px] text-sm">
        <CardHeader className="p-0">
          <CardDescription className="text-[13px] leading-tight">
            {property.tipoInmueble?.nombre || "—"}
          </CardDescription>

          <div className="flex items-center gap-1.5 text-md">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="font-semibold">
              {property.ubicacion}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 pr-3 text-sm">
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3 text-muted-foreground">
            {Number.isFinite(property.cantHabitaciones) && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>{property.cantHabitaciones}</span>
              </span>
            )}
            {Number.isFinite(property.cantBannios) && (
              <span className="inline-flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.cantBannios}</span>
              </span>
            )}
            {Number.isFinite(property.areaM2) && (
              <span className="inline-flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{property.areaM2.toLocaleString()} m²</span>
              </span>
            )}
            {property.amueblado && (
              <Badge variant="secondary" className="h-5 px-2 py-0 text-[11px]">
                Amueblado
              </Badge>
            )}
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div className="flex justify-between w-full">
              <CardDescription className="leading-none mb-1">Precio</CardDescription>
              <p className="font-semibold leading-none">
                {formatPrice(property.precio, "CRC")}
              </p>
            </div>
          </div>
        </CardContent>

        <div className="flex gap-1 justify-end pr-3">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Editar"
            onClick={onEditClick}
            disabled={isLocked}
            title={isLocked ? "No se puede editar una propiedad vendida o reservada" : undefined}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            aria-label="Eliminar"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Can resource="propiedades" action="update">
        {(() => (
          <FormEditPropiedad
            open={openEdit}
            onOpenChange={setOpenEdit}
            property={property}
            estadosPropiedad={estadosPropiedad}
            tiposInmueble={tiposInmueble}
            disabled={isLocked}
          />
        ))()}
      </Can>

      <Can resource="propiedades" action="delete">
        <ConfirmDialog
          open={openConfirmDelete}
          onOpenChange={setOpenConfirmDelete}
          title="Anular propiedad"
          description={`¿Seguro que deseas anular la propiedad #${property.idPropiedad} en ${property.ubicacion}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          loading={deleteProp.isPending as boolean}
        />
      </Can>
    </Card>
  );
};

export default CardPropiedad;