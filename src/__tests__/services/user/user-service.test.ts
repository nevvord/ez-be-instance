import { describe, it, expect } from 'bun:test';
import { getUserById, createUser } from '../../../services/user/user-service';
import type { CreateUserBody } from '../../../api/validators';

describe('User Service', () => {
  describe('getUserById', () => {
    it('should return user data with the same ID as provided', async () => {
      // Arrange
      const userId = '12345';
      
      // Act
      const result = await getUserById(userId);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(typeof result.email).toBe('string');
      expect(typeof result.firstName).toBe('string');
      expect(typeof result.lastName).toBe('string');
      expect(typeof result.createdAt).toBe('string');
    });
  });
  
  describe('createUser', () => {
    it('should create a user with the provided data', async () => {
      // Arrange
      const userData: CreateUserBody = {
        email: 'test@example.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User'
      };
      
      // Act
      const result = await createUser(userData);
      
      // Assert
      expect(result).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.email).toBe(userData.email);
      expect(result.firstName).toBe(userData.firstName);
      expect(result.lastName).toBe(userData.lastName);
      expect(typeof result.createdAt).toBe('string');
    });
  });
}); 