/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response model for simplex solver
 */
export type SimplexResponse = {
    /**
     * Optimal values for decision variables
     */
    variables: Record<string, number>;
    /**
     * Optimal value of the objective function
     */
    'z': number;
    /**
     * Whether the solution was found
     */
    success: boolean;
    /**
     * Additional information about the solution
     */
    message: string;
};

