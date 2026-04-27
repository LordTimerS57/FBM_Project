import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RefreshCw, Trophy } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { useProblemStore } from "@/lib/problem-store";
import type { SimplexResponse } from "@/lib/api-client";
import { useEffect } from "react";

const SolveResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { objectiveType, numVariables, reset, getVarLabel, setCurrentStep } = useProblemStore();
  
  // Récupérer le résultat de l'API depuis l'état de navigation
  const apiResult = location.state?.result as SimplexResponse | undefined;
  
  // Rediriger si aucun résultat n'est disponible (accès direct sans saisie)
  useEffect(() => {
    if (!apiResult) {
      navigate("/setup", { replace: true });
      return;
    }
    // Passer à l'étape 3 (résultats) quand on arrive sur cette page
    setCurrentStep(2);
  }, [apiResult, navigate, setCurrentStep]);
  
  // Utiliser les données de l'API ou des valeurs par défaut si pas de résultat
  const result = apiResult || {
    variables: {},
    z: 0,
    success: false,
    message: "Aucun résultat disponible"
  };

  const decisionVars = Array.from({ length: numVariables }, (_, i) => ({
    name: getVarLabel(i),
    raw: `x${i + 1}`,
    value: result.variables[`x${i + 1}`] ?? 0,
  }));

  // Calculer les variables d'écart (simplifié - dans une vraie implémentation, elles viendraient de l'API)
  const slackVars = [
    { name: "s₁", value: 0 },
    { name: "s₂", value: 0 },
    { name: "s₃", value: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 container py-10 max-w-5xl">
        <div className="mb-10">
          <Stepper
            current={2}
            steps={[
              { label: "Objectif", description: "Profits ou Coûts" },
              { label: "Équations", description: "Objectif & contraintes" },
              { label: "Résultats", description: "Solution optimale" },
            ]}
          />
        </div>

        {/* Hero résultat */}
        <section className="relative overflow-hidden rounded-2xl glass-panel p-8 md:p-12 mb-8 animate-slide-up">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative space-y-6">
            <div className="flex items-center gap-2 text-success text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Solution optimale trouvée
            </div>

            <div>
              <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-2">
                {objectiveType === "max" ? "Profit optimal" : "Pertes minimales"}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl md:text-7xl font-bold text-gradient num">
                  {result.z.toFixed(2)}
                </span>
                <span className="text-2xl text-muted-foreground font-mono">
                  {objectiveType === "max" ? "unités de profit" : "unités de coût"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-primary" />
              {objectiveType === "max" 
                ? "Solution optimale : maximisation des profits sous contraintes"
                : "Solution optimale : minimisation des coûts sous contraintes"}
            </div>
          </div>
        </section>

        {/* Variables */}
        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Variables de décision
            </div>
            <div className="space-y-2">
              {decisionVars.map((v) => (
                <div
                  key={v.raw}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-foreground capitalize">
                      {v.name}
                    </span>
                    {v.name !== v.raw && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        ({v.raw})
                      </span>
                    )}
                  </div>
                  <span className="font-mono num text-2xl font-bold text-primary">
                    {v.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Variables d'écart
            </div>
            <div className="space-y-2">
              {slackVars.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <span className="font-mono text-base text-muted-foreground">{v.name}</span>
                  <span className="font-mono num text-xl font-semibold text-accent">
                    {v.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interprétation */}
        <section className="rounded-xl border border-border bg-surface-elevated/50 p-6 mb-8">
          <h3 className="font-semibold mb-2">Interprétation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La combinaison optimale alloue les ressources disponibles pour atteindre
            la meilleure valeur de Z. Les variables d'écart non nulles indiquent les
            ressources inutilisées au point optimal.
          </p>
        </section>

        {/* Actions */}
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link to="/setup">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Modifier les équations
            </Link>
          </Button>

          <Button
            onClick={() => {
              reset();
              navigate("/");
            }}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Nouveau problème
          </Button>
        </nav>
      </main>
    </div>
  );
};

export default SolveResult;
