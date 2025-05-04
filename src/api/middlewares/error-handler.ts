import type { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '@shared/types';
import type { ApiErrorData } from '@shared/types';
import { logger } from '@shared/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Check if the error is our custom API error
  const apiError = err as Partial<ApiErrorData>;
  if (apiError.code && apiError.statusCode) {
    return res.status(apiError.statusCode).json(
      createErrorResponse(apiError.code, apiError.message || 'Error', apiError.details)
    );
  }

  // Handle unknown errors
  return res.status(500).json(
    createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'Internal server error',
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
}; 