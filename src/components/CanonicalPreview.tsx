import { useProblemStore } from "@/lib/problem-store";

/** Affiche la formulation canonique du problème (style "système avec accolade"). */
export function CanonicalPreview() {
  const {
    objectiveType,
    numVariables,
    objectiveCoefficients,
    constraints,
    getVarLabel,
  } = useProblemStore();

  const varIndices = Array.from({ length: numVariables }, (_, i) => i);

  const formatTerm = (coef: string, varLabel: string, isFirst: boolean) => {
    const trimmed = (coef ?? "").trim();
    if (trimmed === "" || trimmed === "0") return null;
    const num = Number(trimmed);
    const sign = !Number.isNaN(num) && num < 0 ? "−" : isFirst ? "" : "+";
    const abs = !Number.isNaN(num) ? Math.abs(num).toString() : trimmed;
    const display = abs === "1" ? "" : abs;
    return (
      <span className="inline-flex items-baseline gap-1">
        {!isFirst && <span className="text-muted-foreground">{sign}</span>}
        {isFirst && sign === "−" && <span className="text-muted-foreground">−</span>}
        <span>{display}</span>
        <span className="font-semibold">{varLabel}</span>
      </span>
    );
  };

  const renderExpression = (coefs: string[]) => {
    const parts: React.ReactNode[] = [];
    let isFirst = true;
    varIndices.forEach((i) => {
      const node = formatTerm(coefs[i] ?? "", getVarLabel(i), isFirst);
      if (node) {
        parts.push(<span key={i}>{node}</span>);
        isFirst = false;
      }
    });
    if (parts.length === 0) return <span className="text-muted-foreground italic">…</span>;
    return <span className="inline-flex flex-wrap items-baseline gap-1.5">{parts}</span>;
  };

  const opSymbol = (op: string) => (op === "<=" ? "≤" : op === ">=" ? "≥" : "=");

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated/40 p-5 md:p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Aperçu — Forme canonique
      </div>

      <div className="flex gap-3 font-mono text-base">
        <div
          aria-hidden
          className="shrink-0 w-3 border-l-2 border-t-2 border-b-2 border-primary/60 rounded-l-md"
        />
        <div className="flex-1 space-y-1.5 py-1">
          {constraints.map((c, idx) => (
            <div key={c.id} className="flex flex-wrap items-baseline gap-2">
              {renderExpression(c.coefficients)}
              <span className="text-primary font-bold">{opSymbol(c.op)}</span>
              <span>{c.rhs.trim() === "" ? "?" : c.rhs}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">C{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border font-mono text-base flex flex-wrap items-baseline gap-2">
        <span className="font-bold text-primary">
          {objectiveType === "max" ? "MAX" : "MIN"}(Z =
        </span>
        {renderExpression(objectiveCoefficients)}
        <span className="font-bold text-primary">)</span>
      </div>
    </div>
  );
}
