import type { SimplexStep } from "@/lib/simplex-types";

interface SimplexTableauProps {
  step: SimplexStep;
}

const fmt = (n: number) => {
  if (Number.isInteger(n)) return n.toString();
  const r = Math.round(n * 1000) / 1000;
  return r.toString();
};

export function SimplexTableau({ step }: SimplexTableauProps) {
  const pivotRow = step.pivot?.row;
  const pivotCol = step.pivot?.col;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full num text-sm">
        <thead>
          <tr className="bg-surface-elevated border-b border-border">
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
              Base
            </th>
            {step.columns.map((col, i) => (
              <th
                key={col}
                className={`px-4 py-3 text-right font-semibold transition-colors ${
                  pivotCol === i
                    ? "bg-primary/15 text-primary"
                    : i === step.columns.length - 1
                    ? "text-accent"
                    : "text-foreground"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {step.rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-border/60 transition-colors ${
                pivotRow === ri ? "bg-primary/10" : "hover:bg-surface-elevated/50"
              }`}
            >
              <td className="px-4 py-3 text-left font-mono font-semibold text-primary">
                {row.label}
              </td>
              {row.cells.map((cell, ci) => {
                const isPivot = pivotRow === ri && pivotCol === ci;
                return (
                  <td
                    key={ci}
                    className={`px-4 py-3 text-right font-mono ${
                      isPivot
                        ? "bg-primary text-primary-foreground font-bold"
                        : pivotCol === ci
                        ? "text-primary"
                        : ci === row.cells.length - 1
                        ? "text-accent font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {fmt(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-surface-elevated/70 border-t-2 border-border-strong">
            <td className="px-4 py-3 text-left font-mono font-bold text-foreground">
              Z<sub>j</sub> − C<sub>j</sub>
            </td>
            {step.objectiveRow.map((v, ci) => (
              <td
                key={ci}
                className={`px-4 py-3 text-right font-mono font-semibold ${
                  pivotCol === ci
                    ? "text-primary"
                    : ci === step.objectiveRow.length - 1
                    ? "text-accent"
                    : v < 0
                    ? "text-warning"
                    : "text-muted-foreground"
                }`}
              >
                {fmt(v)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
