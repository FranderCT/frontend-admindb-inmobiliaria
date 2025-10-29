import { ReactNode, useState, useEffect } from "react";
import { AppSidebar } from "./modules/app/components/AppSidebar";
import { cn } from "./lib/utils";

type AppProps = {
  hideSidebar?: boolean;
  children: ReactNode;
};

function App({ hideSidebar = false, children }: AppProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (hideSidebar) setOpen(false);
  }, [hideSidebar]);

  return (
    <div className="relative min-h-screen w-full bg-background">
      {!hideSidebar && <AppSidebar isOpen={open} setIsOpen={setOpen} />}

      <main
        className={cn(
          "relative min-h-screen px-4 pb-4 pt-0 pr-4",
          "transition-[padding] duration-300 ease-in-out",
          hideSidebar ? "lg:pl-0" : open ? "lg:pl-64" : "lg:pl-4"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default App;
