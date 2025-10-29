import altosDelValleAPI from "@/api/altosdelvalle"
import { redirect } from "@tanstack/react-router"

export type Role = 'ADMINISTRADOR' | 'AGENTE' | 'LECTOR'

export interface JwtPayload {
  sub: number
  email: string
  exp: number 
  rol?: Role
  name: string
}

export const getToken = () => localStorage.getItem('token') ?? null

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.')
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getRolesFromPayload(p?: JwtPayload | null): Role[] {
  if (!p) return []

  const candidates: Array<Role | Role[] | undefined> = [
    p.rol,
  ]

  for (const c of candidates) {
    if (!c) continue
    if (Array.isArray(c)) return c
    return [c]
  }
  return []
}

export function isExpired(p?: JwtPayload | null): boolean {
  if (!p?.exp) return true
  // exp viene en segundos
  return Date.now() >= p.exp * 1000
}

export function hasAnyRole(userRoles: Role[], required?: Role[]): boolean {
  if (!required || required.length === 0) return true
  return required.some(r => userRoles.includes(r))
}

export function requireAuth(args: { locationPathname: string; requiredRoles?: Role[] }) {
  const token = getToken()
  if (!token) {
    throw redirect({
      to: `/login?${new URLSearchParams({ reason: 'unauthenticated', redirect: args.locationPathname }).toString()}`,
    })
  }

  const payload = decodeJwt(token)
  if (!payload || isExpired(payload)) {
    localStorage.removeItem('token')
    throw redirect({
      to: `/login?${new URLSearchParams({ reason: 'expired', redirect: args.locationPathname }).toString()}`, // ✅ tipado
    })
  }
  altosDelValleAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`

  const roles = getRolesFromPayload(payload)
  if (!hasAnyRole(roles, args.requiredRoles)) {
    throw redirect({ to: '/403' }) 
  }

  return { token, payload, roles }
}

export type LoginSearch = {
    redirect?: string
    reason?: 'expired' | 'unauthenticated'
}