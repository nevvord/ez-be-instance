import { describe, expect, it } from 'bun:test';
import {
  createAppError,
  createNotFoundError,
  createBadRequestError,
  createUnauthorizedError,
  createForbiddenError,
  createConflictError,
  isAppError,
  type AppError
} from '../../../shared/utils/error-factory';

describe('Error Factory', () => {
  describe('createAppError', () => {
    it('should create an error with the correct properties', () => {
      const message = 'Test error message';
      const statusCode = 418;
      const code = 'IM_A_TEAPOT';
      const details = { reason: 'testing' };
      
      const error = createAppError(message, statusCode, code, details);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.code).toBe(code);
      expect(error.details).toBe(details);
      expect(error.isAppError).toBe(true);
    });
    
    it('should use default values when not provided', () => {
      const message = 'Test error message';
      
      const error = createAppError(message);
      
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.details).toBeUndefined();
      expect(error.isAppError).toBe(true);
    });
  });
  
  describe('Specialized error factories', () => {
    it('should create a NotFoundError with correct properties', () => {
      const error = createNotFoundError();
      
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('Resource not found');
    });
    
    it('should create a BadRequestError with correct properties', () => {
      const error = createBadRequestError();
      
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toBe('Bad request');
    });
    
    it('should create an UnauthorizedError with correct properties', () => {
      const error = createUnauthorizedError();
      
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.message).toBe('Unauthorized');
    });
    
    it('should create a ForbiddenError with correct properties', () => {
      const error = createForbiddenError();
      
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
      expect(error.message).toBe('Forbidden');
    });
    
    it('should create a ConflictError with correct properties', () => {
      const error = createConflictError();
      
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
      expect(error.message).toBe('Conflict');
    });
    
    it('should allow custom messages and details', () => {
      const message = 'Custom not found message';
      const details = { id: '123' };
      
      const error = createNotFoundError(message, details);
      
      expect(error.message).toBe(message);
      expect(error.details).toBe(details);
    });
  });
  
  describe('isAppError', () => {
    it('should return true for app errors', () => {
      const error = createAppError('Test');
      
      expect(isAppError(error)).toBe(true);
    });
    
    it('should return false for regular errors', () => {
      const error = new Error('Regular error');
      
      expect(isAppError(error)).toBe(false);
    });
    
    it('should return false for non-error objects', () => {
      expect(isAppError({})).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
    });
  });
}); 