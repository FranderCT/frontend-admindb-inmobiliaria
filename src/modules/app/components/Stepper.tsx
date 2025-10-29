import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type StepDef = {
  key: string;
  label: string;
  description?: string;
  Icon: LucideIcon;
};

type StepperProps = {
  steps: StepDef[];
  currentKey: string; // key del paso actual
};

export default function Stepper({ steps, currentKey }: StepperProps) {
  const currentIndex = Math.max(0, steps.findIndex(s => s.key === currentKey));

  return (
    <div className="relative">
      {/* línea de fondo */}
      <div className="absolute left-0 right-0 top-5 h-px bg-muted" />

      {/* items */}
      <ol
        className={cn(
          "relative z-10 grid gap-6",
          // auto-columns según cantidad de pasos
          steps.length === 3 ? "grid-cols-3" :
          steps.length === 4 ? "grid-cols-4" : `grid-cols-${steps.length}`
        )}
      >
        {steps.map((s, i) => {
          const isCurrent = i === currentIndex;
          return (
            <li key={s.key} className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center ring-1 ring-muted-foreground/10",
                  isCurrent ? "bg-foreground text-background" : "bg-muted text-foreground/70"
                )}
              >
                <s.Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="mt-2 text-sm font-semibold">
                {s.label}
              </div>
              {!!s.description && (
                <p className="mt-1 text-xs text-muted-foreground max-w-[16ch]">
                  {s.description}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
