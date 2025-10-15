import { useState } from "react"
import { AppSidebar } from "./modules/app/components/AppSidebar"
import { cn } from "./lib/utils"

function App({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative min-h-screen w-full bg-background">
      <AppSidebar isOpen={open} setIsOpen={setOpen} />
      <main
        className={cn(
          "relative min-h-screen px-4 pb-4 pt-0 pr-4",
          "transition-[padding] duration-300 ease-in-out",
          open ? "lg:pl-64" : "lg:pl-4" 
        )}
      >
        {children}
      </main>
    </div>
  )
}

export default App
