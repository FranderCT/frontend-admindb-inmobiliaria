"use client"

import { Link } from "@tanstack/react-router"
import { Menu, X, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SidebarProps } from "../types/sidebarTypes"
import { navigation } from "./navigation"

import {
  SidebarProvider,
  Sidebar as RSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/animate-ui/components/radix/sidebar"

export function AppSidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Botón único: se mueve con translate-x igual que el sidebar */}
      <button
        type="button"
        aria-label="Abrir/Cerrar menú"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 left-4 z-50 grid h-9 w-9 place-items-center rounded-xl",
          "bg-white border border-slate-300 ring-1 ring-slate-200 shadow-sm",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-64" : "translate-x-0"
        )}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar fijo; el PROVIDER va DENTRO del aside */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white shadow-sm",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarProvider>
          <RSidebar className="w-64">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <img src="/AltosDelValleLogo.png" alt="Altos del Valle" className="h-9 w-9 rounded-md" />
                    <div className="leading-tight">
                      <div className="text-sm font-semibold text-slate-900">Altos del Valle</div>
                      <div className="text-xs text-slate-500">Inmobiliaria</div>
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            "text-slate-900 hover:bg-gray-100",
                            "[&.active]:text-blue-600 [&.active]:bg-transparent",
                            "[&_svg]:text-inherit"
                          )}
                          onClick={() => {
                            if (window.innerWidth < 1024) setIsOpen(false)
                          }}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-gray-100">
                      <Settings className="h-4 w-4" />
                      <span>Configuración</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-gray-100">
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </RSidebar>
        </SidebarProvider>
      </aside>

      {/* Overlay móvil */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
