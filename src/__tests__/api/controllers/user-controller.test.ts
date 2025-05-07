import { describe, it, expect, mock } from 'bun:test';
import { Request, Response } from 'express';

// Создаем мок-функции для зависимостей
const mockGetUserById = mock(async (id: string) => ({
  id,
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date().toISOString()
}));

const mockCreateUser = mock(async (userData: any) => ({
  id: 'new-user-id',
  ...userData,
  createdAt: new Date().toISOString()
}));

// Мокируем сервисы
mock.module('../../../services/user/user-service', () => ({
  getUserById: mockGetUserById,
  createUser: mockCreateUser
}));

// Мокируем валидаторы
mock.module('../../../api/validators', () => ({
  getUserInfoSchema: {
    safeParse: (data: any) => {
      if (data && data.id) {
        return { success: true, data };
      }
      return { 
        success: false, 
        error: new Error('Validation failed')
      };
    }
  },
  createUserSchema: {
    safeParse: (data: any) => {
      if (data && data.email && data.password) {
        return { success: true, data };
      }
      return { 
        success: false, 
        error: new Error('Validation failed')
      };
    }
  }
}));

// Мокируем типы
const validationError = new Error('Validation error') as any;
validationError.code = 'VALIDATION_ERROR';

mock.module('../../../shared/types', () => ({
  createSuccessResponse: (data: any) => ({ 
    status: 'success', 
    data 
  }),
  createZodValidationError: () => validationError
}));

// Импортируем контроллер после мокирования модулей
import { getUserInfo, createUser } from '../../../api/controllers/user-controller';

describe('User Controller', () => {
  describe('getUserInfo', () => {
    it('should return user data when valid ID is provided', async () => {
      // Arrange
      mockGetUserById.mockClear();
      
      const userId = '123';
      const req: Partial<Request> = {
        body: { id: userId }
      };
      
      const res: Partial<Response> = {
        status: mock(function(this: any) { return this; }),
        json: mock()
      };
      
      const next = mock();
      
      // Act
      await getUserInfo(
        req as Request,
        res as Response,
        next
      );
      
      // Assert
      expect(mockGetUserById).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalled();
      const responseData = (res.json as any).mock.calls[0]?.[0];
      expect(responseData).toBeDefined();
      expect(responseData.status).toBe('success');
      expect(responseData.data.id).toBe(userId);
    });
    
    it('should call next with validation error when invalid data is provided', async () => {
      // Arrange
      mockGetUserById.mockClear();
      
      const req: Partial<Request> = {
        body: {} // Пустое тело запроса
      };
      
      const res: Partial<Response> = {
        status: mock(function(this: any) { return this; }),
        json: mock()
      };
      
      const next = mock();
      
      // Act
      await getUserInfo(
        req as Request,
        res as Response,
        next
      );
      
      // Assert
      expect(mockGetUserById).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect((next.mock.calls[0]?.[0] as any)?.code).toBe('VALIDATION_ERROR');
    });
    
    it('should call next with service error when service throws', async () => {
      // Arrange
      mockGetUserById.mockClear();
      
      const userId = '123';
      const req: Partial<Request> = {
        body: { id: userId }
      };
      
      const res: Partial<Response> = {
        status: mock(function(this: any) { return this; }),
        json: mock()
      };
      
      const next = mock();
      
      const serviceError = new Error('Service error');
      mockGetUserById.mockImplementationOnce(async () => { 
        throw serviceError; 
      });
      
      // Act
      await getUserInfo(
        req as Request,
        res as Response,
        next
      );
      
      // Assert
      expect(mockGetUserById).toHaveBeenCalledWith(userId);
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('createUser', () => {
    it('should create and return user when valid data is provided', async () => {
      // Arrange
      mockCreateUser.mockClear();
      
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      const req: Partial<Request> = {
        body: userData
      };
      
      const res: Partial<Response> = {
        status: mock(function(this: any) { return this; }),
        json: mock()
      };
      
      const next = mock();
      
      // Act
      await createUser(
        req as Request,
        res as Response,
        next
      );
      
      // Assert
      expect(mockCreateUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = (res.json as any).mock.calls[0]?.[0];
      expect(responseData).toBeDefined();
      expect(responseData.status).toBe('success');
      expect(responseData.data.email).toBe(userData.email);
    });
    
    it('should call next with validation error when invalid data is provided', async () => {
      // Arrange
      mockCreateUser.mockClear();
      
      const req: Partial<Request> = {
        body: { email: 'test@example.com' } // Отсутствует password
      };
      
      const res: Partial<Response> = {
        status: mock(function(this: any) { return this; }),
        json: mock()
      };
      
      const next = mock();
      
      // Act
      await createUser(
        req as Request,
        res as Response,
        next
      );
      
      // Assert
      expect(mockCreateUser).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect((next.mock.calls[0]?.[0] as any)?.code).toBe('VALIDATION_ERROR');
    });
    
    it('should call next with service error when service throws', async () => {
      // Arrange
      mockCreateUser.mockClear();
      
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      const req: Partial<Request> = {
        body: userData
      };
      
      const res: Partial<Response> = {
        status: mock(function(this: any) { return this; }),
        json: mock()
      };
      
      const next = mock();
      
      const serviceError = new Error('Service error');
      mockCreateUser.mockImplementationOnce(async () => { 
        throw serviceError; 
      });
      
      // Act
      await createUser(
        req as Request,
        res as Response,
        next
      );
      
      // Assert
      expect(mockCreateUser).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(serviceError);
    });
  });
}); 