/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A single constraint
 */
export type Constraint = {
    /**
     * Coefficients for each variable
     */
    coeffs?: Record<string, number>;
    /**
     * Type of constraint
     */
    type: Constraint.type;
    /**
     * Right-hand side value (must be positive)
     */
    'b': number;
};
export namespace Constraint {
    /**
     * Type of constraint
     */
    export enum type {
        LE = '<=',
        GE = '>=',
        EQ = '=',
    }
}

