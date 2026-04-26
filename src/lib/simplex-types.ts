export type ObjectiveType = "max" | "min";
export type ConstraintOp = "<=" | ">=" | "=";

export interface ProblemConstraint {
  id: string;
  /** Coefficients par variable (longueur = numVariables). Vide => 0. */
  coefficients: string[];
  op: ConstraintOp;
  rhs: string;
}

export interface SimplexProblem {
  objectiveType: ObjectiveType;
  /** Nombre de variables de décision. */
  numVariables: number;
  /** Noms personnalisés (optionnels). Si vide => x1, x2, … */
  variableNames: string[];
  /** Coefficients de la fonction objectif (longueur = numVariables). */
  objectiveCoefficients: string[];
  constraints: ProblemConstraint[];
}

/** Étape (mock) — la vraie viendra de l'API back. Sert au design du tableau. */
export interface SimplexStep {
  iteration: number;
  basis: string[];
  columns: string[];
  rows: Array<{
    label: string;
    cells: number[];
  }>;
  objectiveRow: number[];
  pivot?: { row: number; col: number };
  enteringVar?: string;
  leavingVar?: string;
  zValue: number;
  note?: string;
}
