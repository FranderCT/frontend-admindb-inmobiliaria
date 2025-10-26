import { ReactNode } from "react"
import { Action, Resource, useCan } from "../utils/permissions"

type CanProps = {
  resource: Resource
  action: Action
  children: ReactNode
  fallback?: ReactNode
  mode?: "hide" | "disable" 
}

export function Can({ resource, action, children, fallback = null, mode = "hide" }: CanProps) {
  const allowed = useCan(resource, action)

  if (allowed) return <>{children}</>

  if (mode === "disable") {
    const child = Array.isArray(children) ? children[0] : children
    if (child && typeof child === "object" && "props" in child) {
      return <child.type {...child.props} disabled />
    }
  }

  return <>{fallback}</>
}
