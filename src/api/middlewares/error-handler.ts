import { Request, Response, NextFunction } from 'express';
import { isAppError, AppError } from '@shared/utils';
import { logger } from '@shared/utils';

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Default error response
  const defaultError = {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
    details: {} as Record<string, any> | undefined
  };

  // Check if it's an AppError
  if (isAppError(err)) {
    // If it's our custom error, we have all the details
    defaultError.statusCode = err.statusCode;
    defaultError.code = err.code;
    defaultError.message = err.message;
    defaultError.details = err.details;

    // Log appropriately based on status code
    if (err.statusCode >= 500) {
      logger.error(`[${err.code}] ${err.message}`, { 
        url: req.originalUrl,
        details: err.details,
        stack: err.stack
      });
    } else {
      logger.warn(`[${err.code}] ${err.message}`, { 
        url: req.originalUrl,
        details: err.details
      });
    }
  } else {
    // For unknown errors, log the full error
    logger.error('Unexpected error', {
      error: err.message,
      url: req.originalUrl,
      stack: err.stack
    });
  }

  // In production, don't expose error details for 500 errors
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && defaultError.statusCode >= 500) {
    return res.status(defaultError.statusCode).json({
      status: 'error',
      code: defaultError.code,
      message: 'Internal server error'
    });
  }

  // Return the error response
  return res.status(defaultError.statusCode).json({
    status: 'error',
    code: defaultError.code,
    message: defaultError.message,
    details: defaultError.details
  });
}; 