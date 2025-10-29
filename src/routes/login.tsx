
import FormLogin from '@/modules/seguridad/components/FormLogin'
import { getToken, decodeJwt, isExpired, LoginSearch } from '@/modules/seguridad/utils/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const redirect =
      typeof search.redirect === 'string' ? search.redirect : undefined
    const reason =
      search.reason === 'expired' || search.reason === 'unauthenticated'
        ? search.reason
        : undefined
    return { redirect, reason }
  },
  component: RouteComponent,
  beforeLoad: ({ search }) => {
    const token = getToken()
    const payload = token ? decodeJwt(token) : null
    if (token && payload && !isExpired(payload)) {
      throw redirect({ to: search.redirect ?? '/' })
    }
  },
})

function RouteComponent() {
  return <div className="relative h-screen w-full">
    <FormLogin />
  </div>
}
