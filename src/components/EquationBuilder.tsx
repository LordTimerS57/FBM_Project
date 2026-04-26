import { Plus, Trash2, ArrowRight, Tag, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProblemStore } from "@/lib/problem-store";
import type { ConstraintOp } from "@/lib/simplex-types";

const ops: ConstraintOp[] = ["<=", ">=", "="];
const opSymbol: Record<ConstraintOp, string> = {
  "<=": "≤",
  ">=": "≥",
  "=": "=",
};

export function EquationBuilder() {
  const {
    objectiveType,
    numVariables,
    variableNames,
    objectiveCoefficients,
    constraints,
    setNumVariables,
    setVariableName,
    setObjectiveCoefficient,
    addConstraint,
    removeConstraint,
    updateConstraint,
    setConstraintCoefficient,
    getVarLabel,
  } = useProblemStore();

  const varIndices = Array.from({ length: numVariables }, (_, i) => i);

  return (
    <div className="space-y-8">
      {/* Nombre de variables */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Nombre de variables
          </Label>
          <div className="glass-panel rounded-xl p-1 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setNumVariables(numVariables - 1)}
              disabled={numVariables <= 1}
              className="shrink-0"
              aria-label="Diminuer"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={10}
              value={numVariables}
              onChange={(e) => setNumVariables(Number(e.target.value))}
              className="border-0 bg-transparent font-mono text-center text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setNumVariables(numVariables + 1)}
              disabled={numVariables >= 10}
              className="shrink-0"
              aria-label="Augmenter"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Type de problème
          </Label>
          <div className="h-[52px] flex items-center px-4 rounded-xl border border-border bg-surface-elevated/60 font-mono text-sm">
            <span className="font-bold text-primary">
              {objectiveType === "max" ? "Maximisation" : "Minimisation"}
            </span>
            <span className="ml-auto text-muted-foreground">Z = c·x</span>
          </div>
        </div>
      </section>

      {/* Noms des variables (optionnels) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Tag className="h-3.5 w-3.5" />
            Noms des variables
          </Label>
          <span className="text-[11px] font-medium text-muted-foreground">
            optionnel — laissez vide pour <span className="font-mono text-foreground">x₁, x₂, …</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {varIndices.map((i) => (
            <div
              key={i}
              className="glass-panel rounded-lg p-1 flex items-center gap-1"
            >
              <span className="px-2 font-mono text-xs font-bold text-primary shrink-0">
                x{i + 1}
              </span>
              <span className="text-muted-foreground">=</span>
              <Input
                value={variableNames[i] ?? ""}
                onChange={(e) => setVariableName(i, e.target.value)}
                placeholder="ex: pizza"
                className="border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-9 px-2"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Système : contraintes empilées avec accolade + objectif */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Forme canonique
          </Label>
          <span className="text-[11px] font-medium text-muted-foreground">
            {constraints.length} contrainte{constraints.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-4 md:p-6">
          <div className="flex gap-3">
            {/* Accolade gauche */}
            <div
              aria-hidden
              className="shrink-0 w-3 border-l-2 border-t-2 border-b-2 border-primary/60 rounded-l-md"
            />

            <div className="flex-1 space-y-2">
              {constraints.map((c, idx) => (
                <ConstraintRow
                  key={c.id}
                  index={idx}
                  varIndices={varIndices}
                  coefficients={c.coefficients}
                  op={c.op}
                  rhs={c.rhs}
                  getVarLabel={getVarLabel}
                  onCoefChange={(i, v) => setConstraintCoefficient(c.id, i, v)}
                  onOpChange={(op) => updateConstraint(c.id, { op })}
                  onRhsChange={(rhs) => updateConstraint(c.id, { rhs })}
                  onRemove={() => removeConstraint(c.id)}
                  canRemove={constraints.length > 1}
                />
              ))}

              <Button
                variant="outline"
                onClick={addConstraint}
                className="w-full border-dashed border-border-strong hover:border-primary hover:bg-primary/5 hover:text-primary h-10 mt-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une contrainte
              </Button>
            </div>
          </div>

          {/* Fonction objectif sous le système */}
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary mr-1">
                {objectiveType === "max" ? "MAX" : "MIN"}(Z =
              </span>
              <CoefficientInputs
                varIndices={varIndices}
                coefficients={objectiveCoefficients}
                getVarLabel={getVarLabel}
                onChange={setObjectiveCoefficient}
              />
              <span className="font-mono text-sm font-bold text-primary">)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions de non-négativité */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-elevated/50 rounded-lg px-4 py-3 border border-border">
        <ArrowRight className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono">
          {varIndices.map((i) => getVarLabel(i)).join(", ")} ≥ 0
        </span>
        <span className="ml-auto">Conditions de non-négativité appliquées par défaut</span>
      </div>
    </div>
  );
}

/* --------------------------- sub-components --------------------------- */

interface ConstraintRowProps {
  index: number;
  varIndices: number[];
  coefficients: string[];
  op: ConstraintOp;
  rhs: string;
  getVarLabel: (i: number) => string;
  onCoefChange: (i: number, v: string) => void;
  onOpChange: (op: ConstraintOp) => void;
  onRhsChange: (rhs: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function ConstraintRow({
  index,
  varIndices,
  coefficients,
  op,
  rhs,
  getVarLabel,
  onCoefChange,
  onOpChange,
  onRhsChange,
  onRemove,
  canRemove,
}: ConstraintRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 group animate-fade-in">
      <span className="font-mono text-[11px] font-bold text-muted-foreground w-8 shrink-0">
        C{index + 1}
      </span>

      <CoefficientInputs
        varIndices={varIndices}
        coefficients={coefficients}
        getVarLabel={getVarLabel}
        onChange={onCoefChange}
      />

      <select
        value={op}
        onChange={(e) => onOpChange(e.target.value as ConstraintOp)}
        className="bg-surface-elevated border border-border rounded-lg px-2 h-9 font-mono text-base font-bold text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Opérateur"
      >
        {ops.map((o) => (
          <option key={o} value={o}>
            {opSymbol[o]}
          </option>
        ))}
      </select>

      <Input
        value={rhs}
        onChange={(e) => onRhsChange(e.target.value)}
        placeholder="0"
        className="font-mono text-right h-9 w-20"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label={`Supprimer la contrainte ${index + 1}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

interface CoefficientInputsProps {
  varIndices: number[];
  coefficients: string[];
  getVarLabel: (i: number) => string;
  onChange: (i: number, v: string) => void;
}

function CoefficientInputs({
  varIndices,
  coefficients,
  getVarLabel,
  onChange,
}: CoefficientInputsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {varIndices.map((i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && (
            <span className="font-mono text-base font-bold text-muted-foreground px-0.5">
              +
            </span>
          )}
          <Input
            value={coefficients[i] ?? ""}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder="0"
            className="font-mono text-right h-9 w-14 px-2"
          />
          <span className="font-mono text-sm font-semibold text-foreground whitespace-nowrap">
            {getVarLabel(i)}
          </span>
        </div>
      ))}
    </div>
  );
}
