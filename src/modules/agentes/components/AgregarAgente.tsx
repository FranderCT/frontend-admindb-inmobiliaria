import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/animate-ui/components/radix/alert-dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Agent } from '../models/agent'

type DialogAgregarAgenteProps = {
  from?: 'top' | 'right' | 'bottom' | 'left'
  trigger: ReactNode
  onAgregarAgente?: (agent: Agent) => void
}

const DialogAgregarAgente = ({ from = 'bottom', trigger, onAgregarAgente }: DialogAgregarAgenteProps) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    lastname1: '',
    lastname2: '',
    phone: '',
    accumulatedcommission: '',
    status: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nuevoAgente: Agent = {
      id: parseInt(formData.id),
      name: formData.name,
      lastname1: formData.lastname1,
      lastname2: formData.lastname2,
      phone: formData.phone,
      accumulatedcommission: parseFloat(formData.accumulatedcommission) || 0,
      status: formData.status,
    }

    if (onAgregarAgente) {
      onAgregarAgente(nuevoAgente)
    }

    // Limpiar formulario
    setFormData({
      id: '',
      name: '',
      lastname1: '',
      lastname2: '',
      phone: '',
      accumulatedcommission: '',
      status: true,
    })

    // Cerrar el diálogo
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent from={from} className="max-w-md">
        <div className="absolute right-3 top-3">
          <AlertDialogCancel asChild>
            <Button variant="ghost" size="icon">
              <X />
            </Button>
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader className="mb-4 pr-10">
          <AlertDialogTitle className="text-xl">
            Agregar Nuevo Agente
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Identificación</Label>
            <Input
                id="id"
                name="id"
                type="text"
                inputMode="numeric"
                placeholder="101230456"
                value={formData.id}
                onChange={handleInputChange}
                autoComplete="off"
                required
            />
            </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="María"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastname1">Primer Apellido</Label>
              <Input
                id="lastname1"
                name="lastname1"
                type="text"
                placeholder="González"
                value={formData.lastname1}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname2">Segundo Apellido</Label>
              <Input
                id="lastname2"
                name="lastname2"
                type="text"
                placeholder="Rodríguez"
                value={formData.lastname2}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+506 8888-1234"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="status"
              name="status"
              type="checkbox"
              checked={formData.status}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary"
            />
            <Label htmlFor="status" className="cursor-pointer">
              Agente activo
            </Label>
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </AlertDialogCancel>
            <Button type="submit">
              Agregar Agente
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DialogAgregarAgente