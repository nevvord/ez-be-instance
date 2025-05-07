import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test';

// Мок для dotenv.config
const mockDotenvConfig = mock(() => ({ parsed: {} }));

// Мокируем модуль dotenv
mock('dotenv', () => ({
  config: mockDotenvConfig
}));

describe('App Config', () => {
  // Сохраняем исходные переменные окружения
  const originalEnv = { ...process.env };
  
  // Базовые значения для тестов
  const testEnv = {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret',
    JWT_REFRESH_SECRET: 'test-jwt-refresh-secret',
    COOKIE_SECRET: 'test-cookie-secret',
    CSRF_SECRET: 'test-csrf-secret',
    DATABASE_URL: 'test-db-url',
    PORT: '4000',
    HOST: 'test-host',
    LOG_LEVEL: 'debug'
  };
  
  beforeAll(() => {
    // Устанавливаем базовые переменные окружения для тестов
    process.env = {
      ...originalEnv,
      ...testEnv
    };
    
    // Очищаем кэш модулей для каждого теста
    delete require.cache[require.resolve('../../config/app-config')];
  });

  afterAll(() => {
    // Восстанавливаем переменные окружения
    process.env = originalEnv;
  });

  it('should load configuration with environment variables', () => {
    // Загружаем модуль конфигурации
    const { config } = require('../../config/app-config');
    
    // Проверяем загруженные значения
    expect(config.NODE_ENV).toBe(testEnv.NODE_ENV);
    expect(config.JWT_SECRET).toBe(testEnv.JWT_SECRET);
    expect(config.JWT_REFRESH_SECRET).toBe(testEnv.JWT_REFRESH_SECRET);
    expect(config.COOKIE_SECRET).toBe(testEnv.COOKIE_SECRET);
    expect(config.CSRF_SECRET).toBe(testEnv.CSRF_SECRET);
    expect(config.DATABASE_URL).toBe(testEnv.DATABASE_URL);
    expect(config.PORT).toBe(parseInt(testEnv.PORT));
    expect(config.HOST).toBe(testEnv.HOST);
    expect(config.LOG_LEVEL).toBe(testEnv.LOG_LEVEL);
  });

  it('should set sensible fallback values when NODE_ENV is development', () => {
    // Устанавливаем development окружение
    process.env.NODE_ENV = 'development';
    
    // Удаляем необязательные переменные для development
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.COOKIE_SECRET;
    delete process.env.CSRF_SECRET;
    delete process.env.DATABASE_URL;
    
    // Перезагружаем конфигурацию
    delete require.cache[require.resolve('../../config/app-config')];
    const { config } = require('../../config/app-config');
    
    // Проверяем, что есть дефолтные значения для development
    expect(config.NODE_ENV).toBe('development');
    expect(config.JWT_SECRET).toBeDefined();
    expect(config.JWT_REFRESH_SECRET).toBeDefined();
    expect(config.COOKIE_SECRET).toBeDefined();
    expect(config.CSRF_SECRET).toBeDefined();
    expect(config.DATABASE_URL).toBeDefined();
  });
}); 