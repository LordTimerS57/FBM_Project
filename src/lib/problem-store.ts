import { create } from "zustand";
import type {
  ObjectiveType,
  ProblemConstraint,
  ResolutionMode,
  SimplexProblem,
} from "./simplex-types";

interface ProblemStore extends SimplexProblem {
  setObjectiveType: (t: ObjectiveType) => void;
  setMode: (m: ResolutionMode) => void;
  setNumVariables: (n: number) => void;
  setVariableName: (index: number, name: string) => void;
  setObjectiveCoefficient: (index: number, value: string) => void;
  addConstraint: () => void;
  removeConstraint: (id: string) => void;
  updateConstraint: (id: string, patch: Partial<ProblemConstraint>) => void;
  setConstraintCoefficient: (id: string, index: number, value: string) => void;
  reset: () => void;
  /** Renvoie le nom affiché pour une variable (custom ou x_i). */
  getVarLabel: (index: number) => string;
}

const newId = () => Math.random().toString(36).slice(2, 9);

const blankConstraint = (n: number): ProblemConstraint => ({
  id: newId(),
  coefficients: Array(n).fill(""),
  op: "<=",
  rhs: "",
});

const DEFAULT_VARS = 2;

const initial: SimplexProblem = {
  objectiveType: "max",
  numVariables: DEFAULT_VARS,
  variableNames: Array(DEFAULT_VARS).fill(""),
  objectiveCoefficients: Array(DEFAULT_VARS).fill(""),
  constraints: [blankConstraint(DEFAULT_VARS), blankConstraint(DEFAULT_VARS)],
  mode: "step",
};

const resizeArr = (arr: string[], n: number) => {
  const next = arr.slice(0, n);
  while (next.length < n) next.push("");
  return next;
};

export const useProblemStore = create<ProblemStore>((set, get) => ({
  ...initial,

  setObjectiveType: (t) => set({ objectiveType: t }),
  setMode: (m) => set({ mode: m }),

  setNumVariables: (n) => {
    const safe = Math.max(1, Math.min(10, Math.floor(n) || 1));
    set((s) => ({
      numVariables: safe,
      variableNames: resizeArr(s.variableNames, safe),
      objectiveCoefficients: resizeArr(s.objectiveCoefficients, safe),
      constraints: s.constraints.map((c) => ({
        ...c,
        coefficients: resizeArr(c.coefficients, safe),
      })),
    }));
  },

  setVariableName: (index, name) =>
    set((s) => {
      const next = [...s.variableNames];
      next[index] = name;
      return { variableNames: next };
    }),

  setObjectiveCoefficient: (index, value) =>
    set((s) => {
      const next = [...s.objectiveCoefficients];
      next[index] = value;
      return { objectiveCoefficients: next };
    }),

  addConstraint: () =>
    set((s) => ({
      constraints: [...s.constraints, blankConstraint(s.numVariables)],
    })),

  removeConstraint: (id) =>
    set((s) => ({ constraints: s.constraints.filter((c) => c.id !== id) })),

  updateConstraint: (id, patch) =>
    set((s) => ({
      constraints: s.constraints.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    })),

  setConstraintCoefficient: (id, index, value) =>
    set((s) => ({
      constraints: s.constraints.map((c) => {
        if (c.id !== id) return c;
        const next = [...c.coefficients];
        next[index] = value;
        return { ...c, coefficients: next };
      }),
    })),

  reset: () =>
    set({
      ...initial,
      variableNames: Array(DEFAULT_VARS).fill(""),
      objectiveCoefficients: Array(DEFAULT_VARS).fill(""),
      constraints: [blankConstraint(DEFAULT_VARS), blankConstraint(DEFAULT_VARS)],
    }),

  getVarLabel: (index) => {
    const s = get();
    const custom = s.variableNames[index]?.trim();
    return custom && custom.length > 0 ? custom : `x${index + 1}`;
  },
}));
