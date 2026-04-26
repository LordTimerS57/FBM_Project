import type { SimplexStep } from "./simplex-types";

/** Données factices pour le design uniquement. À remplacer par la réponse de l'API. */
export const mockSteps: SimplexStep[] = [
  {
    iteration: 0,
    basis: ["s1", "s2", "s3"],
    columns: ["x1", "x2", "s1", "s2", "s3", "RHS"],
    rows: [
      { label: "s1", cells: [2, 1, 1, 0, 0, 18] },
      { label: "s2", cells: [2, 3, 0, 1, 0, 42] },
      { label: "s3", cells: [3, 1, 0, 0, 1, 24] },
    ],
    objectiveRow: [-3, -2, 0, 0, 0, 0],
    pivot: { row: 2, col: 0 },
    enteringVar: "x1",
    leavingVar: "s3",
    zValue: 0,
    note: "Tableau initial. Tous les Z_j − C_j négatifs : x1 entre, s3 sort.",
  },
  {
    iteration: 1,
    basis: ["s1", "s2", "x1"],
    columns: ["x1", "x2", "s1", "s2", "s3", "RHS"],
    rows: [
      { label: "s1", cells: [0, 1 / 3, 1, 0, -2 / 3, 2] },
      { label: "s2", cells: [0, 7 / 3, 0, 1, -2 / 3, 26] },
      { label: "x1", cells: [1, 1 / 3, 0, 0, 1 / 3, 8] },
    ],
    objectiveRow: [0, -1, 0, 0, 1, 24],
    pivot: { row: 0, col: 1 },
    enteringVar: "x2",
    leavingVar: "s1",
    zValue: 24,
    note: "x2 entre, s1 sort.",
  },
  {
    iteration: 2,
    basis: ["x2", "s2", "x1"],
    columns: ["x1", "x2", "s1", "s2", "s3", "RHS"],
    rows: [
      { label: "x2", cells: [0, 1, 3, 0, -2, 6] },
      { label: "s2", cells: [0, 0, -7, 1, 4, 12] },
      { label: "x1", cells: [1, 0, -1, 0, 1, 6] },
    ],
    objectiveRow: [0, 0, 3, 0, -1, 30],
    zValue: 30,
    note: "Solution optimale atteinte : Z = 30, x1 = 6, x2 = 6.",
  },
];
