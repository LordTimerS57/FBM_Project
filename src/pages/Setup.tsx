import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, FastForward, ListOrdered, TrendingDown, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { EquationBuilder } from "@/components/EquationBuilder";
import { CanonicalPreview } from "@/components/CanonicalPreview";
import { Button } from "@/components/ui/button";
import { useProblemStore } from "@/lib/problem-store";
import type { ObjectiveType, ResolutionMode } from "@/lib/simplex-types";

const Setup = () => {
  const navigate = useNavigate();
  const { objectiveType, setObjectiveType, mode, setMode } = useProblemStore();

  const handleSolve = () => {
    if (mode === "step") navigate("/solve/steps");
    else navigate("/solve/result");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 container py-10 max-w-5xl">
        <div className="mb-10">
          <Stepper
            current={1}
            steps={[
              { label: "Type", description: "Max ou Min" },
              { label: "Équations", description: "Objectif & contraintes" },
              { label: "Résolution", description: "Étapes ou résultat" },
            ]}
          />
        </div>

        <div className="space-y-10">
          {/* Type de problème */}
          <section className="space-y-4">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Configuration du problème
              </h1>
              <p className="text-muted-foreground mt-1">
                Définissez l'objectif d'optimisation et la forme de résolution souhaitée.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    value: "max",
                    label: "Maximisation",
                    sub: "Max Z",
                    icon: TrendingUp,
                  },
                  {
                    value: "min",
                    label: "Minimisation",
                    sub: "Min Z",
                    icon: TrendingDown,
                  },
                ] as { value: ObjectiveType; label: string; sub: string; icon: typeof TrendingUp }[]
              ).map(({ value, label, sub, icon: Icon }) => {
                const active = objectiveType === value;
                return (
                  <button
                    key={value}
                    onClick={() => setObjectiveType(value)}
                    className={`text-left rounded-xl border p-4 flex items-center gap-4 transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg shrink-0 ${
                        active
                          ? "bg-gradient-primary text-primary-foreground"
                          : "bg-surface-elevated text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                        {sub}
                      </div>
                      <div className="font-semibold">{label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Équations */}
          <section className="rounded-2xl glass-panel p-6 md:p-8">
            <EquationBuilder />
          </section>

          {/* Aperçu canonique */}
          <CanonicalPreview />

          {/* Mode de résolution */}
          <section className="space-y-4">
            <header>
              <h2 className="text-lg font-semibold">Mode de résolution</h2>
              <p className="text-sm text-muted-foreground">
                Choisissez d'afficher chaque itération du tableau ou seulement la solution
                finale.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    value: "step",
                    title: "Pas à pas",
                    desc: "Naviguez itération par itération avec mise en évidence du pivot.",
                    icon: ListOrdered,
                  },
                  {
                    value: "direct",
                    title: "Résultat direct",
                    desc: "Obtenez immédiatement la solution optimale et la valeur de Z.",
                    icon: FastForward,
                  },
                ] as { value: ResolutionMode; title: string; desc: string; icon: typeof ListOrdered }[]
              ).map(({ value, title, desc, icon: Icon }) => {
                const active = mode === value;
                return (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`text-left rounded-xl border p-5 transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mb-3 ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <div className="font-semibold mb-1">{title}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleSolve}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-6"
            >
              Résoudre
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;
