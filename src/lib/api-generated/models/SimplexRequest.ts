/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Constraint } from './Constraint';
/**
 * Request model for simplex solver
 */
export type SimplexRequest = {
    /**
     * Type of optimization: maximize or minimize
     */
    objective_type: SimplexRequest.objective_type;
    /**
     * Number of decision variables (1-10)
     */
    num_variables: number;
    /**
     * Objective function coefficients
     */
    objective_coefficients: Array<number>;
    /**
     * List of constraints
     */
    constraints: Array<Constraint>;
};
export namespace SimplexRequest {
    /**
     * Type of optimization: maximize or minimize
     */
    export enum objective_type {
        MAX = 'max',
        MIN = 'min',
    }
}

