import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { createBadRequestError } from '@shared/utils';

// Middleware for validating request data using Zod schema
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Combine request data from different sources
      const data = {
        ...req.body,
        ...req.query,
        ...req.params,
        ...req.cookies
      };
      
      // Validate data against schema
      await schema.parseAsync(data);
      
      return next();
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message
        }));
        
        return next(
          createBadRequestError('Validation error', {
            errors: validationErrors
          })
        );
      }
      
      return next(error);
    }
  };
}; 