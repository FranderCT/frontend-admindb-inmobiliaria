"use client"

import { Link } from "@tanstack/react-router"
import { Menu, X, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import type { SidebarProps } from "../types/sidebarTypes"
import { navigation } from "./navigation"

export function AppSidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Botón único con animación sincronizada */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 z-50 transition-all duration-300 ease-in-out bg-white shadow-md border border-gray-200",
          isOpen ? "left-64 rotate-180" : "left-4 rotate-0"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5 transition-transform duration-300" /> : <Menu className="h-5 w-5 transition-transform duration-300" />}
      </Button>

      {/* Sidebar */}
      <SidebarProvider>
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white shadow-sm transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <RSidebar className="w-64">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <img
                      src="/AltosDelValleLogo.png"
                      alt="Altos del Valle"
                      className="h-9 w-9 rounded-md"
                    />
                    <div className="leading-tight">
                      <div className="text-sm font-semibold text-slate-900">
                        Altos del Valle
                      </div>
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
                            "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                            "[&.active]:bg-gray-200 [&.active]:text-gray-900",
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
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Settings className="h-4 w-4" />
                      <span>Configuración</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </RSidebar>
        </aside>
      </SidebarProvider>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
