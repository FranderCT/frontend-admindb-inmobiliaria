import { redirect } from '@tanstack/react-router'
import { decodeJwt, getRolesFromPayload, getToken, isExpired, type Role } from './auth'

export function protectRoute(locationPath: string, allowedRoles?: Role[]) {
  const token = getToken()
  if (!token) {
    throw redirect({
      to: `/login?reason=unauthenticated&redirect=${encodeURIComponent(locationPath)}`,
    })
  }

  const payload = decodeJwt(token)
  if (!payload || isExpired(payload)) {
    localStorage.removeItem('token')
    throw redirect({
      to: `/login?reason=expired&redirect=${encodeURIComponent(locationPath)}`,
    })
  }

  const roles = getRolesFromPayload(payload)
  if (allowedRoles && !roles.some(r => allowedRoles.includes(r))) {
    throw redirect({ to: '/403' })
  }

  return payload
}
