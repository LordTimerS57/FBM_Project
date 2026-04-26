import { Check } from "lucide-react";

interface Step {
  label: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  current: number; // 0-based
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center w-full gap-2 sm:gap-4">
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <li key={step.label} className="flex-1 flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "bg-surface-elevated border-primary text-primary shadow-glow"
                    : "bg-surface border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <div className="hidden sm:flex flex-col leading-tight min-w-0">
                <span
                  className={`text-sm font-semibold truncate ${
                    active || done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {step.description}
                </span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-px bg-border relative overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-primary transition-all duration-500 ${
                    done ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
