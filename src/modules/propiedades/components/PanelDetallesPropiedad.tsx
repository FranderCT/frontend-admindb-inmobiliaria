import { X, MapPin, Ruler, Bed, Bath, Home, User, Phone, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetPropertyById } from "../hooks/propiedadesHook";
import { formatPrice } from "../utils/formatters";
import { estadoPropiedadVariant } from "@/utils/statusVariants";
import { capitalize } from "@/utils/capitalize";
import { Skeleton } from "@/components/ui/skeleton";

interface PropiedadDetailPanelProps {
  idPropiedad: number;
  onClose: () => void;
}

const placeholder =
  "https://images.adsttc.com/media/images/623c/4fa0/3e4b/3145/3000/001b/newsletter/_d_ambrosio_07._copy.jpg?1648119692";

const PropiedadDetailPanel = ({ idPropiedad, onClose }: PropiedadDetailPanelProps) => {
  const { propiedad, loadingProp, errorProp } = useGetPropertyById(idPropiedad);

  if (loadingProp) {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-1/2 bg-background border-l shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl mb-6" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    );
  }

  if (errorProp || !propiedad) {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-1/2 bg-background border-l shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Error</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-destructive">No se pudo cargar la información de la propiedad.</p>
        </div>
      </div>
    );
  }

  const imagenUrl = propiedad.imagenUrl || placeholder;

  return (
    <>
      {/* Panel deslizante */}
      <div className="fixed inset-y-0 right-0 w-155  bg-background border-l shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header con botón cerrar */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">Detalles de Propiedad</h2>
                {propiedad.estadoPropiedad?.nombre && (
                  <Badge
                    variant={estadoPropiedadVariant[propiedad.estadoPropiedad.nombre]}
                    className="rounded-full px-3 py-1"
                  >
                    {capitalize(propiedad.estadoPropiedad.nombre)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">ID: #{propiedad.idPropiedad}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Imagen principal */}
          <div className="mb-6">
            <img
              src={imagenUrl}
              alt={propiedad.ubicacion}
              className="w-full h-[400px] object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Información principal */}
          <div className="space-y-6">
            {/* Ubicación y Tipo */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">{propiedad.tipoInmueble?.nombre || "—"}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-2xl font-semibold">{propiedad.ubicacion}</h3>
              </div>
              
              {/* Precio destacado */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-xs mb-1">Precio</CardDescription>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(propiedad.precio, "CRC")}
                      </div>
                    </div>
                    <DollarSign className="h-12 w-12 text-primary/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Características */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Características</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Ruler className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardDescription className="text-xs">Área</CardDescription>
                      <p className="text-lg font-semibold">
                        {propiedad.areaM2 > 0 ? `${propiedad.areaM2.toLocaleString()} m²` : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Bed className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardDescription className="text-xs">Habitaciones</CardDescription>
                      <p className="text-lg font-semibold">
                        {propiedad.cantHabitaciones > 0 ? propiedad.cantHabitaciones : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Bath className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardDescription className="text-xs">Baños</CardDescription>
                      <p className="text-lg font-semibold">
                        {propiedad.cantBannios > 0 ? propiedad.cantBannios : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Home className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardDescription className="text-xs">Amueblado</CardDescription>
                      <p className="text-lg font-semibold">
                        {propiedad.amueblado ? "Sí" : "No"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Información del Cliente */}
            {propiedad.cliente && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Información del Propietario</h4>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {propiedad.cliente.nombre} {propiedad.cliente.apellido1} {propiedad.cliente.apellido2}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3" />
                          {propiedad.cliente.telefono}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Identificación:</strong> {propiedad.cliente.identificacion}</p>
                      <p><strong>Estado:</strong> {propiedad.cliente.estado ? "Activo" : "Inactivo"}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropiedadDetailPanel;