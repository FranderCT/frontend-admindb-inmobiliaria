import { useState } from "react"
import { SidebarProvider } from "./components/animate-ui/components/radix/sidebar"
import { AppSidebar } from "./modules/app/components/AppSidebar"
import { cn } from "./lib/utils"

function App({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider>
      <AppSidebar isOpen={open} setIsOpen={setOpen} />
      <main
        className={cn(
          "flex flex-col flex-1 p-3 space-y-2",
          "transition-[padding] duration-300 ease-in-out",
          open ? "lg:pl-70" : "lg:pl-10"
        )}
      >
        {children}
      </main>
    </SidebarProvider>
  )
}

export default App
