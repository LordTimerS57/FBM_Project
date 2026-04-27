/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SimplexRequest } from '../models/SimplexRequest';
import type { SimplexResponse } from '../models/SimplexResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Root
     * Root endpoint
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Health
     * Health check endpoint
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Solve
     * Solve a linear programming problem using the simplex method
     *
     * Args:
     * request: SimplexRequest with objective_type, num_variables, objective_coefficients, and constraints
     *
     * Returns:
     * SimplexResponse with optimal variable values and objective function value
     * @param requestBody
     * @returns SimplexResponse Successful Response
     * @throws ApiError
     */
    public static solveSolvePost(
        requestBody: SimplexRequest,
    ): CancelablePromise<SimplexResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/solve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
