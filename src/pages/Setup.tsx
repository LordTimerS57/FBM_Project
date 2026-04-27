import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, TrendingDown, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Stepper } from "@/components/Stepper";
import { EquationBuilder } from "@/components/EquationBuilder";
import { CanonicalPreview } from "@/components/CanonicalPreview";
import { Button } from "@/components/ui/button";
import { useProblemStore } from "@/lib/problem-store";
import { useApiStatusStore } from "@/lib/api-status-store";
import { simplexAPI, type SimplexRequest } from "@/lib/api-client";
import { SimplexRequest as SimplexRequestModel } from "@/lib/api-generated";
import { useState } from "react";
import { toast } from "sonner";
import type { ObjectiveType } from "@/lib/simplex-types";

const Setup = () => {
  const navigate = useNavigate();
  const { objectiveType, setObjectiveType, numVariables, objectiveCoefficients, constraints, getVarLabel, setCurrentStep } = useProblemStore();
  const apiStatus = useApiStatusStore();
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (): boolean => {
    // Vérifier que tous les coefficients de l'objectif sont remplis
    for (let i = 0; i < numVariables; i++) {
      const coef = objectiveCoefficients[i]?.trim();
      if (coef === "" || coef === undefined) {
        toast.error(`Veuillez remplir le coefficient de la variable ${getVarLabel(i)}`);
        return false;
      }
      const num = parseFloat(coef);
      if (isNaN(num)) {
        toast.error(`Le coefficient de ${getVarLabel(i)} doit être un nombre valide`);
        return false;
      }
    }

    // Vérifier que toutes les contraintes sont remplies
    for (let i = 0; i < constraints.length; i++) {
      const constraint = constraints[i];
      
      // Vérifier les coefficients
      for (let j = 0; j < numVariables; j++) {
        const coef = constraint.coefficients[j]?.trim();
        if (coef === "" || coef === undefined) {
          toast.error(`Contrainte ${i + 1}: Veuillez remplir le coefficient de ${getVarLabel(j)}`);
          return false;
        }
        const num = parseFloat(coef);
        if (isNaN(num)) {
          toast.error(`Contrainte ${i + 1}: Le coefficient de ${getVarLabel(j)} doit être un nombre valide`);
          return false;
        }
      }

      // Vérifier le RHS
      const rhs = constraint.rhs?.trim();
      if (rhs === "" || rhs === undefined) {
        toast.error(`Contrainte ${i + 1}: Veuillez remplir la valeur du RHS`);
        return false;
      }
      const rhsNum = parseFloat(rhs);
      if (isNaN(rhsNum) || rhsNum <= 0) {
        toast.error(`Contrainte ${i + 1}: Le RHS doit être un nombre positif`);
        return false;
      }
    }

    return true;
  };

  const handleSolve = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier l'état de l'API avant de résoudre
      if (apiStatus.status !== "connected") {
        toast.error(
          "Service temporairement indisponible. Veuillez réessayer dans quelques instants.",
          {
            icon: <AlertTriangle className="h-4 w-4" />,
            duration: 5000,
          }
        );
        return;
      }

      // Préparer la requête pour l'API en contournant les types générés
      const request = {
        objective_type: objectiveType,
        num_variables: numVariables,
        objective_coefficients: objectiveCoefficients.map(c => parseFloat(c.trim())),
        constraints: constraints.map(c => ({
          coeffs: c.coefficients.reduce((acc, coef, idx) => {
            acc[`x${idx + 1}`] = parseFloat(coef.trim());
            return acc;
          }, {} as Record<string, number>),
          type: c.op,
          b: parseFloat(c.rhs.trim())
        }))
      } as SimplexRequest;

      const response = await simplexAPI.solve(request);
      
      if (response.success) {
        // Passer à l'étape 3 (résultats) et naviguer
        setCurrentStep(2);
        navigate("/solve/result", { state: { result: response } });
      } else {
        toast.error(response.message || "Erreur lors de la résolution");
      }
    } catch (error) {
      console.error("Error solving:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la résolution";
      
      if (errorMessage.includes("API") || errorMessage.includes("disponible")) {
        toast.error(errorMessage, {
          icon: <AlertTriangle className="h-4 w-4" />,
          duration: 5000,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 container py-10 max-w-5xl">
        {/* Alert API */}
        {apiStatus.status === "disconnected" && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">
                Service temporairement indisponible
              </h3>
              <p className="text-sm text-destructive/80 mt-1">
                Le service de calcul est momentanément inaccessible. Veuillez réessayer dans quelques instants.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Nos équipes sont informées du problème.
              </p>
            </div>
            <button
              onClick={() => apiStatus.checkHealth()}
              className="shrink-0 px-3 py-1.5 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        <div className="mb-10">
          <Stepper
            current={1}
            steps={[
              { label: "Objectif", description: "Profits ou Coûts" },
              { label: "Équations", description: "Objectif & contraintes" },
              { label: "Résultats", description: "Solution optimale" },
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
                    label: "Maximiser les profits",
                    sub: "Max Z - Optimiser revenus",
                    icon: TrendingUp,
                  },
                  {
                    value: "min",
                    label: "Minimiser les pertes",
                    sub: "Min Z - Réduire coûts",
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
              disabled={isLoading}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Résolution en cours...
                </>
              ) : (
                <>
                  Résoudre
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;
