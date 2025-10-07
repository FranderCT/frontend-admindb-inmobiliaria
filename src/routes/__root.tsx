import { useState } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AppSidebar } from '../modules/app/components/AppSidebar'


export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <AppSidebar isOpen={open} setIsOpen={setOpen} />
      <div className="lg:pl-64 p-4">
        <Outlet />
      </div>
    </>
  )
}