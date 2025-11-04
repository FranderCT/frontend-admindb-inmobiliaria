import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Ruler, BedDouble, Bath, Home, User, Phone } from "lucide-react";
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
  open?: boolean;
}

const placeholder =
  "https://images.adsttc.com/media/images/623c/4fa0/3e4b/3145/3000/001b/newsletter/_d_ambrosio_07._copy.jpg?1648119692";

const variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};
const transition = { type: "tween", ease: "easeInOut", duration: 0.35 };

const WIDTH = "w-155";

const PanelChrome: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      className={`
        fixed inset-y-0 right-0 ${WIDTH}
        bg-background/95 backdrop-blur-md
        border-l shadow-[0_8px_32px_rgba(0,0,0,0.08)]
        
        z-[70] flex flex-col overflow-hidden
      `}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

const SkeletonPanel = ({ onClose }: { onClose: () => void }) => (
  <PanelChrome onClose={onClose}>
    <div className="p-6 border-b flex justify-between items-center">
      <Skeleton className="h-7 w-40" />
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
    <div className="p-6 space-y-4">
      <Skeleton className="h-[280px] w-full rounded-2xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-6 w-2/3" />
    </div>
  </PanelChrome>
);

const PropiedadDetailPanel = ({ idPropiedad, onClose, open = true }: PropiedadDetailPanelProps) => {
  const { propiedad, loadingProp, errorProp } = useGetPropertyById(idPropiedad);

  return (
    <AnimatePresence>
      {open && (
        <>
          {loadingProp && <SkeletonPanel onClose={onClose} />}
          {!loadingProp && (errorProp || !propiedad) && (
            <PanelChrome onClose={onClose}>
              <div className="p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Error</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                <p className="text-destructive">No se pudo cargar la información de la propiedad.</p>
              </div>
            </PanelChrome>
          )}

          {!loadingProp && propiedad && (
            <PanelChrome onClose={onClose}>
              <div className="p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">Detalles de Propiedad</h2>
                  <p className="text-sm text-muted-foreground">ID: #{propiedad.idPropiedad}</p>
                </div>
                <div className="flex items-center gap-2">
                  {propiedad.estadoPropiedad?.nombre && (
                    <Badge
                      variant={estadoPropiedadVariant[propiedad.estadoPropiedad.nombre]}
                      className="rounded-full px-3 py-1"
                    >
                      {capitalize(propiedad.estadoPropiedad.nombre)}
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

                          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700
         scrollbar-track-gray-100 ">
                <div className="relative">
                  <img
                    src={propiedad.imagenUrl || placeholder}
                    alt={propiedad.ubicacion}
                    className="w-full h-[340px] object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-3 left-3 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {propiedad.tipoInmueble?.nombre || "—"}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{propiedad.ubicacion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-foreground">{formatPrice(propiedad.precio, "CRC")}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <Card className="text-center py-3">
                    <CardContent className="p-0">
                      <Ruler className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-semibold">{propiedad.areaM2 || ""} m²</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center py-3">
                    <CardContent className="p-0">
                      <BedDouble  className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-semibold">{propiedad.cantHabitaciones || ""} hab</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center py-3">
                    <CardContent className="p-0">
                      <Bath className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-semibold">{propiedad.cantBannios || ""} baños</p>
                    </CardContent>
                  </Card>
                  <div className="text-center py-3">
                    <div className="p-0 flex flex-col items-center">
                                          <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-2xl">
                                              <Home className="h-6 w-6  mb-1" /></div>
                      <p className="text-sm font-semibold">{propiedad.amueblado ? "Amueblado" : "No amueblado"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {propiedad.cliente && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Propietario</h4>
                    <Card className="rounded-xl border-none shadow-sm bg-muted/30">
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
                      <CardContent className="pt-0 text-sm text-muted-foreground">
                        <p><strong>Identificación:</strong> {propiedad.cliente.identificacion}</p>
                        <p><strong>Estado:</strong> {propiedad.cliente.estado ? "Activo" : "Inactivo"}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </PanelChrome>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default PropiedadDetailPanel;