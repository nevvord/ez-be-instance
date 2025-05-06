// Error types
export type AppErrorOptions = {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, any>;
};

// AppError interface to maintain consistent error structure
export interface AppError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, any>;
  isAppError: boolean;
}

// Create custom application error
export const createAppError = (
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: Record<string, any>
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  error.isAppError = true;
  return error;
};

// Factory functions for specific error types
export const createNotFoundError = (message = 'Resource not found', details?: Record<string, any>) => 
  createAppError(message, 404, 'NOT_FOUND', details);

export const createBadRequestError = (message = 'Bad request', details?: Record<string, any>) => 
  createAppError(message, 400, 'BAD_REQUEST', details);

export const createUnauthorizedError = (message = 'Unauthorized', details?: Record<string, any>) => 
  createAppError(message, 401, 'UNAUTHORIZED', details);

export const createForbiddenError = (message = 'Forbidden', details?: Record<string, any>) => 
  createAppError(message, 403, 'FORBIDDEN', details);

export const createConflictError = (message = 'Conflict', details?: Record<string, any>) => 
  createAppError(message, 409, 'CONFLICT', details);

// Error detection helper
export const isAppError = (error: unknown): error is AppError => {
  return !!error && typeof error === 'object' && 'isAppError' in error && error.isAppError === true;
}; 