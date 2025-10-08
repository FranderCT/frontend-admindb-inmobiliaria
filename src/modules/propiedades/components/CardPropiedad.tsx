import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, DollarSign, Home, MapPin, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PropiedadCardProps } from '../types/propiedadTypes'
import { formatPrice } from '../utils/formatters'

const CardPropiedad = ({ property }: PropiedadCardProps) => {
  return (
        <Card key={property.idPropiedad} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg line-clamp-2">{property.ubicacion}</CardTitle>
                <CardDescription className="font-mono text-xs">{property.idPropiedad}</CardDescription>
              </div>
              <Badge >
                {property.idEstado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{property.ubicacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4 text-muted-foreground" />
                      <span>{property.idTipoInmueble}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{formatPrice(property.precio, 'CRC')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-muted-foreground">{property.identificacion}</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> 
  )
}

export default CardPropiedad
