import { Button } from '@/components/ui/button'
import CardPropiedad from '@/modules/propiedades/components/CardPropiedad';
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/propiedades/')({
  component: RouteComponent,
})
const mockPropiedades = [
  {
    idPropiedad: 1,
    ubicacion: "San José, Barrio Escalante",
    precio: 185000000,    // ₡
    idEstado: 1,          // p. ej. Disponible
    identificacion: 101230456,
    idTipoInmueble: 2,    // p. ej. Apartamento
  },
  {
    idPropiedad: 2,
    ubicacion: "Heredia, San Pablo",
    precio: 96000000,
    idEstado: 2,          // p. ej. Reservada
    identificacion: 208760912,
    idTipoInmueble: 1,    // Casa
  },
  {
    idPropiedad: 3,
    ubicacion: "Cartago, Tres Ríos",
    precio: 245000000,
    idEstado: 1,
    identificacion: 304589771,
    idTipoInmueble: 3,    // Lote
  },
  {
    idPropiedad: 4,
    ubicacion: "Alajuela, La Garita",
    precio: 315000000,
    idEstado: 3,          // Vendida
    identificacion: 405671223,
    idTipoInmueble: 1,
  },
  {
    idPropiedad: 5,
    ubicacion: "Guanacaste, Nicoya Centro",
    precio: 120000000,
    idEstado: 1,
    identificacion: 509812334,
    idTipoInmueble: 4,    // Local comercial
  },
];



function RouteComponent() {
  return <div className='m-4'>
    <nav className=' flex items-center justify-between mb-4 ml-15 mt-4'>
      <h1 className='text-4xl font-bold'>Propiedades</h1>
      <Button>
        <Plus /> Agregar Propiedad
      </Button>
    </nav>
    <div className=' w-full flex justify-end gap-4 mb-4'>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Estados</SelectLabel>
            <SelectItem value="apple">Disponible</SelectItem>
            <SelectItem value="banana">Reservada</SelectItem>
            <SelectItem value="blueberry">Vendida</SelectItem>
            <SelectItem value="grapes">Inactiva</SelectItem>
            <SelectItem value="pineapple">Mantenimiento</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipos</SelectLabel>
            <SelectItem value="apple">Apartamento</SelectItem>
            <SelectItem value="banana">Casa</SelectItem>
            <SelectItem value="blueberry">Lote</SelectItem>
            <SelectItem value="grapes">Local comercial</SelectItem>
            <SelectItem value="pineapple">Oficina</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

    </div>
    <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockPropiedades.map((property) => (
        <CardPropiedad key={property.idPropiedad} property={property} />
      ))}
    </main>
  </div>
}
