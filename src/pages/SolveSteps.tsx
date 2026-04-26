import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { SimplexTableau } from "@/components/SimplexTableau";
import { Button } from "@/components/ui/button";
import { mockSteps } from "@/lib/mock-steps";
import { useProblemStore } from "@/lib/problem-store";

const SolveSteps = () => {
  const navigate = useNavigate();
  const { objectiveType } = useProblemStore();
  const [idx, setIdx] = useState(0);
  const steps = mockSteps;
  const step = steps[idx];
  const isFirst = idx === 0;
  const isLast = idx === steps.length - 1;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 container py-10 max-w-6xl">
        <div className="mb-10">
          <Stepper
            current={2}
            steps={[
              { label: "Type", description: "Max ou Min" },
              { label: "Équations", description: "Objectif & contraintes" },
              { label: "Résolution", description: "Étapes du simplexe" },
            ]}
          />
        </div>

        {/* En-tête */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">
              Résolution étape par étape — {objectiveType === "max" ? "Max Z" : "Min Z"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Itération {step.iteration}
              {isLast && (
                <span className="ml-3 text-sm font-medium text-success bg-success/10 border border-success/30 px-2.5 py-1 rounded-full align-middle">
                  ✓ Optimum atteint
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/solve/result")}
              className="border-border-strong"
            >
              <SkipForward className="h-3.5 w-3.5 mr-1.5" />
              Aller au résultat
            </Button>
          </div>
        </header>

        {/* Indicateurs */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <InfoCard label="Variable entrante" value={step.enteringVar ?? "—"} accent="primary" />
          <InfoCard label="Variable sortante" value={step.leavingVar ?? "—"} accent="warning" />
          <InfoCard
            label="Valeur de Z"
            value={step.zValue.toString()}
            accent="accent"
            mono
          />
        </div>

        {/* Tableau */}
        <div className="space-y-4 animate-fade-in" key={idx}>
          <SimplexTableau step={step} />

          {step.note && (
            <div className="rounded-xl border border-border bg-surface-elevated/50 p-4 text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Note&nbsp;: </span>
              {step.note}
            </div>
          )}
        </div>

        {/* Navigation Next/Previous */}
        <nav className="flex items-center justify-between mt-8 pt-6 border-t border-border gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="border-border-strong"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.iteration}
                onClick={() => setIdx(i)}
                aria-label={`Aller à l'itération ${s.iteration}`}
                className={`h-2 rounded-full transition-all ${
                  i === idx
                    ? "w-8 bg-gradient-primary"
                    : "w-2 bg-border hover:bg-border-strong"
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <Button
              size="lg"
              onClick={() => navigate("/solve/result")}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
            >
              Voir le résultat
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </nav>

        <div className="mt-8">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link to="/setup">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Modifier les équations
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

function InfoCard({
  label,
  value,
  accent,
  mono = false,
}: {
  label: string;
  value: string;
  accent: "primary" | "accent" | "warning";
  mono?: boolean;
}) {
  const color =
    accent === "primary"
      ? "text-primary"
      : accent === "accent"
      ? "text-accent"
      : "text-warning";
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${color} ${mono ? "font-mono num" : "font-mono"}`}>
        {value}
      </div>
    </div>
  );
}

export default SolveSteps;
