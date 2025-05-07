import { describe, it, expect } from 'bun:test';
import { getUserInfoSchema, createUserSchema } from '../../../api/validators/user-validator';

describe('User Validators', () => {
  describe('getUserInfoSchema', () => {
    it('should validate a valid user ID', () => {
      // Arrange
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000' // UUID format
      };
      
      // Act
      const result = getUserInfoSchema.safeParse(validData);
      
      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
    
    it('should reject invalid user ID format', () => {
      // Arrange
      const invalidData = {
        id: '123' // Not a UUID
      };
      
      // Act
      const result = getUserInfoSchema.safeParse(invalidData);
      
      // Assert
      expect(result.success).toBe(false);
    });
    
    it('should reject missing user ID', () => {
      // Arrange
      const invalidData = {};
      
      // Act
      const result = getUserInfoSchema.safeParse(invalidData);
      
      // Assert
      expect(result.success).toBe(false);
    });
  });
  
  describe('createUserSchema', () => {
    it('should validate valid user creation data', () => {
      // Arrange
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      // Act
      const result = createUserSchema.safeParse(validData);
      
      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
    
    it('should allow optional fields to be omitted', () => {
      // Arrange
      const validData = {
        email: 'test@example.com',
        password: 'Password123'
      };
      
      // Act
      const result = createUserSchema.safeParse(validData);
      
      // Assert
      expect(result.success).toBe(true);
    });
    
    it('should reject invalid email format', () => {
      // Arrange
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123'
      };
      
      // Act
      const result = createUserSchema.safeParse(invalidData);
      
      // Assert
      expect(result.success).toBe(false);
    });
    
    it('should reject password that is too short', () => {
      // Arrange
      const invalidData = {
        email: 'test@example.com',
        password: '123' // Less than 8 characters
      };
      
      // Act
      const result = createUserSchema.safeParse(invalidData);
      
      // Assert
      expect(result.success).toBe(false);
    });
  });
}); 