import { z } from 'zod';

// API status codes
export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

// API success response interface
export interface ApiSuccessResponse<T> {
  status: ApiStatus.SUCCESS;
  data: T;
}

// API error response interface
export interface ApiErrorResponse {
  status: ApiStatus.ERROR;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Combined API response type
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Function to create success response
export const createSuccessResponse = <T>(data: T): ApiSuccessResponse<T> => {
  return {
    status: ApiStatus.SUCCESS,
    data,
  };
};

// Function to create error response
export const createErrorResponse = (
  code: string,
  message: string,
  details?: unknown
): ApiErrorResponse => {
  return {
    status: ApiStatus.ERROR,
    error: {
      code,
      message,
      details,
    },
  };
};

// API error data structure
export interface ApiErrorData {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

// Function to create a base API error
export const createApiError = (
  message: string, 
  code: string, 
  statusCode: number, 
  details?: unknown
): ApiErrorData & Error => {
  const error = new Error(message) as ApiErrorData & Error;
  error.code = code;
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

// Function to create a validation error
export const createValidationError = (message: string, details?: unknown): ApiErrorData & Error => {
  return createApiError(message, 'VALIDATION_ERROR', 400, details);
};

// Function to create a validation error from Zod error
export const createZodValidationError = (error: z.ZodError): ApiErrorData & Error => {
  const details = {
    errors: error.errors.map(err => ({
      path: err.path,
      message: err.message,
    }))
  };
  return createValidationError('Validation error', details);
};

// Function to create an authentication error
export const createAuthenticationError = (
  message = 'Unauthorized', 
  details?: unknown
): ApiErrorData & Error => {
  return createApiError(message, 'AUTHENTICATION_ERROR', 401, details);
};

// Function to create a forbidden error
export const createForbiddenError = (
  message = 'Forbidden', 
  details?: unknown
): ApiErrorData & Error => {
  return createApiError(message, 'FORBIDDEN_ERROR', 403, details);
};

// Function to create a not found error
export const createNotFoundError = (
  message = 'Resource not found', 
  details?: unknown
): ApiErrorData & Error => {
  return createApiError(message, 'NOT_FOUND_ERROR', 404, details);
}; 