import { useMemo } from 'react'
import { decodeJwt, getRolesFromPayload, getToken, isExpired, Role } from './auth'

type Action = 'view' | 'create' | 'update' | 'delete'
type Resource = 'clientes' | 'contratos' | 'propiedades' | 'facturas' | 'otros'

const PERMISSIONS: Record<Role, Partial<Record<Resource, Action[]>>> = {
  ADMINISTRADOR: { clientes: ['view','create','update','delete'], contratos: ['view','create','update','delete'], propiedades: ['view','create','update','delete'], facturas: ['view','create','update','delete'], otros: ['view','create','update','delete'] },
  AGENTE:        { clientes: ['view','create','update','delete'], contratos: ['view','create','update','delete'], propiedades: ['view','create','update','delete'], facturas: ['view','create','update','delete'] },
  LECTOR:       { clientes: ['view'], contratos: ['view'], propiedades: ['view'], facturas: ['view'] },
}

export function useCan(resource: Resource, action: Action) {
  return useMemo(() => {
    const token = getToken()
    const payload = token ? decodeJwt(token) : null
    if (!payload || isExpired(payload)) return false
    const roles = getRolesFromPayload(payload)
    if (roles.length === 0) return false

    return roles.some(role => PERMISSIONS[role]?.[resource]?.includes(action))
  }, [resource, action])
}
