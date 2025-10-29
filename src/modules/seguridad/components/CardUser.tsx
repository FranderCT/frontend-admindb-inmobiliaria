import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'
import { CardUserProps } from '../types/userTypes'

const CardUser = ({ user }: CardUserProps) => {
  return (
    <Card>
       <CardHeader>
        <User/>
        <CardTitle>{user.nombre} {user.apellido1} {user.apellido2}</CardTitle>
       </CardHeader>
       <CardContent>
        <p>Email: {user.email}</p>
        <p>Rol: {user.idRolUsuario}</p>
        <p>Estado: {user.estado ? 'Activo' : 'Inactivo'}</p>
       </CardContent>
    </Card>
  )
}

export default CardUser
