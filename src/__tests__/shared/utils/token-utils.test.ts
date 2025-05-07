import { describe, expect, it, beforeEach, mock, afterAll } from 'bun:test';
import jwt from 'jsonwebtoken';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyAccessToken, 
  verifyRefreshToken 
} from '../../../shared/utils/token-utils';
import { config } from '@config';
import { JwtPayload, AccessTokenPayload, RefreshTokenPayload } from '@shared/types/auth';

// Сохраняем оригинальные методы JWT
const originalSign = jwt.sign;
const originalVerify = jwt.verify;

// Создаем моки для методов JWT
const mockSign = mock((...args: any[]) => '');
const mockVerify = mock((...args: any[]) => ({}));

describe('Token Utilities', () => {
  beforeEach(() => {
    // Устанавливаем моки перед каждым тестом
    jwt.sign = mockSign as any;
    jwt.verify = mockVerify as any;
    
    // Очищаем счетчики вызовов моков
    mockSign.mockClear();
    mockVerify.mockClear();
  });
  
  // Восстанавливаем оригинальные методы после всех тестов
  afterAll(() => {
    jwt.sign = originalSign;
    jwt.verify = originalVerify;
  });

  describe('generateAccessToken', () => {
    it('should generate an access token with the correct payload and options', () => {
      // Arrange
      const mockSignResult = 'mock-access-token';
      const payload: JwtPayload = { 
        userId: '123', 
        email: 'test@example.com',
        role: 'user'
      };
      
      mockSign.mockImplementation(() => mockSignResult);

      // Act
      const result = generateAccessToken(payload);

      // Assert
      expect(result).toBe(mockSignResult);
      expect(mockSign).toHaveBeenCalled();
      expect(mockSign.mock.calls[0]?.[0]).toEqual({ ...payload, type: 'access' });
      expect(mockSign.mock.calls[0]?.[1]).toBe(config.JWT_SECRET);
      expect(mockSign.mock.calls[0]?.[2]).toEqual({ expiresIn: config.JWT_ACCESS_EXPIRATION });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token with the correct payload, tokenId and options', () => {
      // Arrange
      const mockSignResult = 'mock-refresh-token';
      const payload: JwtPayload = { 
        userId: '123', 
        email: 'test@example.com',
        role: 'user'
      };
      const tokenId = 'test-token-id';
      
      mockSign.mockImplementation(() => mockSignResult);

      // Act
      const result = generateRefreshToken(payload, tokenId);

      // Assert
      expect(result).toBe(mockSignResult);
      expect(mockSign).toHaveBeenCalled();
      expect(mockSign.mock.calls[0]?.[0]).toEqual({ ...payload, type: 'refresh', tokenId });
      expect(mockSign.mock.calls[0]?.[1]).toBe(config.JWT_REFRESH_SECRET);
      expect(mockSign.mock.calls[0]?.[2]).toEqual({ expiresIn: config.JWT_REFRESH_EXPIRATION });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return the access token payload', () => {
      // Arrange
      const token = 'valid-access-token';
      const expectedPayload: AccessTokenPayload = { 
        userId: '123', 
        email: 'test@example.com',
        role: 'user',
        type: 'access' 
      };
      
      mockVerify.mockImplementation(() => expectedPayload);

      // Act
      const result = verifyAccessToken(token);

      // Assert
      expect(result).toEqual(expectedPayload);
      expect(mockVerify).toHaveBeenCalled();
      expect(mockVerify.mock.calls[0]?.[0]).toBe(token);
      expect(mockVerify.mock.calls[0]?.[1]).toBe(config.JWT_SECRET);
    });

    it('should throw an error if token verification fails', () => {
      // Arrange
      const token = 'invalid-token';
      
      mockVerify.mockImplementation(() => {
        throw new Error('jwt error');
      });

      // Act & Assert
      expect(() => verifyAccessToken(token)).toThrow('Invalid access token');
      expect(mockVerify).toHaveBeenCalled();
      expect(mockVerify.mock.calls[0]?.[0]).toBe(token);
      expect(mockVerify.mock.calls[0]?.[1]).toBe(config.JWT_SECRET);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return the refresh token payload', () => {
      // Arrange
      const token = 'valid-refresh-token';
      const expectedPayload: RefreshTokenPayload = { 
        userId: '123', 
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
        tokenId: 'test-token-id'
      };
      
      mockVerify.mockImplementation(() => expectedPayload);

      // Act
      const result = verifyRefreshToken(token);

      // Assert
      expect(result).toEqual(expectedPayload);
      expect(mockVerify).toHaveBeenCalled();
      expect(mockVerify.mock.calls[0]?.[0]).toBe(token);
      expect(mockVerify.mock.calls[0]?.[1]).toBe(config.JWT_REFRESH_SECRET);
    });

    it('should throw an error if token verification fails', () => {
      // Arrange
      const token = 'invalid-token';
      
      mockVerify.mockImplementation(() => {
        throw new Error('jwt error');
      });

      // Act & Assert
      expect(() => verifyRefreshToken(token)).toThrow('Invalid refresh token');
      expect(mockVerify).toHaveBeenCalled();
      expect(mockVerify.mock.calls[0]?.[0]).toBe(token);
      expect(mockVerify.mock.calls[0]?.[1]).toBe(config.JWT_REFRESH_SECRET);
    });
  });
}); 