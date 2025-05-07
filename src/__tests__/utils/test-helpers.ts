import { mock, type Mock } from 'bun:test';
import { Request, Response, NextFunction } from 'express';

/**
 * Создает мок Express запроса
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides
  };
};

/**
 * Создает мок Express ответа
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  
  res.status = mock(function(this: any, code: number) { 
    return this; 
  });
  
  res.json = mock(function(this: any, data: any) { 
    return this; 
  });
  
  res.send = mock(function(this: any, data: any) { 
    return this; 
  });
  
  res.cookie = mock(function(this: any, name: string, value: string, options?: any) {
    return this;
  });
  
  res.clearCookie = mock(function(this: any, name: string) {
    return this;
  });

  return res;
};

/**
 * Создает мок для функции next
 */
export const createMockNext = (): Mock<(error?: any) => void> => {
  return mock();
};

/**
 * Тип для объектов запроса и ответа Express в тестах
 */
export type ExpressTestContext = {
  req: Partial<Request>;
  res: Partial<Response>;
  next: Mock<(error?: any) => void>;
};

/**
 * Создает контекст для тестирования Express контроллеров
 */
export const createExpressContext = (requestOverrides: Partial<Request> = {}): ExpressTestContext => {
  return {
    req: createMockRequest(requestOverrides),
    res: createMockResponse(),
    next: createMockNext()
  };
};

/**
 * Проверяет, что функция была вызвана с ожидаемыми аргументами
 */
export const expectCalledWith = (
  mockFn: Mock<any>, 
  expectedArgs: any[]
): void => {
  expect(mockFn).toHaveBeenCalled();
  
  const actualArgs = mockFn.mock.calls[0];
  expectedArgs.forEach((expected, index) => {
    expect(actualArgs[index]).toEqual(expected);
  });
};

/**
 * Проверяет, что функция не была вызвана
 */
export const expectNotCalled = (mockFn: Mock<any>): void => {
  expect(mockFn).not.toHaveBeenCalled();
}; 