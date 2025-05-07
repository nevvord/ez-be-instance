import { describe, it, expect } from 'bun:test';
import { z } from 'zod';
import { 
  createSuccessResponse, 
  createErrorResponse,
  createApiError,
  createValidationError,
  createZodValidationError,
  createAuthenticationError,
  createForbiddenError,
  createNotFoundError,
  ApiStatus
} from '../../../shared/types/api-types';

describe('API Types', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with the provided data', () => {
      // Arrange
      const data = { id: '123', name: 'Test' };
      
      // Act
      const result = createSuccessResponse(data);
      
      // Assert
      expect(result).toEqual({
        status: ApiStatus.SUCCESS,
        data
      });
    });
  });
  
  describe('createErrorResponse', () => {
    it('should create an error response with the provided details', () => {
      // Arrange
      const code = 'TEST_ERROR';
      const message = 'Test error message';
      const details = { field: 'test' };
      
      // Act
      const result = createErrorResponse(code, message, details);
      
      // Assert
      expect(result).toEqual({
        status: ApiStatus.ERROR,
        error: {
          code,
          message,
          details
        }
      });
    });
    
    it('should create an error response without details', () => {
      // Arrange
      const code = 'TEST_ERROR';
      const message = 'Test error message';
      
      // Act
      const result = createErrorResponse(code, message);
      
      // Assert
      expect(result).toEqual({
        status: ApiStatus.ERROR,
        error: {
          code,
          message
        }
      });
    });
  });
  
  describe('createApiError', () => {
    it('should create an error with the correct properties', () => {
      // Arrange
      const message = 'Test error';
      const code = 'TEST_ERROR';
      const statusCode = 400;
      const details = { test: true };
      
      // Act
      const error = createApiError(message, code, statusCode, details);
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.statusCode).toBe(statusCode);
      expect(error.details).toBe(details);
    });
  });
  
  describe('createValidationError', () => {
    it('should create a validation error with the correct properties', () => {
      // Arrange
      const message = 'Validation failed';
      const details = { fields: ['name', 'email'] };
      
      // Act
      const error = createValidationError(message, details);
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.details).toBe(details);
    });
  });
  
  describe('createZodValidationError', () => {
    it('should create a validation error from a Zod error', () => {
      // Arrange
      const schema = z.object({
        name: z.string(),
        email: z.string().email()
      });
      const badData = { name: 123, email: 'not-an-email' };
      
      // Создаем ошибку валидации Zod 
      let zodError: z.ZodError | null = null;
      try {
        schema.parse(badData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          zodError = error;
        }
      }
      
      expect(zodError).not.toBeNull();
      
      // Act
      const error = createZodValidationError(zodError!);
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Validation error');
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });
  
  describe('createAuthenticationError', () => {
    it('should create an authentication error with default message', () => {
      // Act
      const error = createAuthenticationError();
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Unauthorized');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });
    
    it('should create an authentication error with custom message and details', () => {
      // Arrange
      const message = 'Custom auth error';
      const details = { token: 'invalid' };
      
      // Act
      const error = createAuthenticationError(message, details);
      
      // Assert
      expect(error.message).toBe(message);
      expect(error.details).toBe(details);
    });
  });
  
  describe('createForbiddenError', () => {
    it('should create a forbidden error with default message', () => {
      // Act
      const error = createForbiddenError();
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Forbidden');
      expect(error.code).toBe('FORBIDDEN_ERROR');
      expect(error.statusCode).toBe(403);
    });
  });
  
  describe('createNotFoundError', () => {
    it('should create a not found error with default message', () => {
      // Act
      const error = createNotFoundError();
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND_ERROR');
      expect(error.statusCode).toBe(404);
    });
  });
}); 