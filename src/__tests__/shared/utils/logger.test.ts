import { describe, it, expect, beforeEach, mock, afterEach } from 'bun:test';
import winston from 'winston';
import { config } from '@config';

// Сохраняем оригинальные методы
const originalCreateLogger = winston.createLogger;
const originalFormat = winston.format;
const originalTransports = winston.transports;

// Мокаем winston
const mockFormatCombine = mock(() => mockFormatCombine);
const mockFormatTimestamp = mock(() => mockFormatTimestamp);
const mockFormatColorize = mock(() => mockFormatColorize);
const mockFormatPrintf = mock(() => mockFormatPrintf);

const mockFormat = {
  combine: mockFormatCombine,
  timestamp: mockFormatTimestamp,
  colorize: mockFormatColorize,
  printf: mockFormatPrintf,
};

const mockLogger = {
  level: '',
  format: {},
  transports: [],
  add: mock(),
};

const mockCreateLogger = mock(() => mockLogger);
const mockConsole = mock(() => {});
const mockFile = mock(() => {});

const mockTransports = {
  Console: mockConsole,
  File: mockFile,
};

describe('Logger', () => {
  beforeEach(() => {
    // Устанавливаем моки
    winston.createLogger = mockCreateLogger;
    winston.format = mockFormat as any;
    winston.transports = mockTransports as any;
    
    // Очищаем счетчики вызовов
    mockCreateLogger.mockClear();
    mockFormatCombine.mockClear();
    mockFormatTimestamp.mockClear();
    mockFormatColorize.mockClear();
    mockFormatPrintf.mockClear();
    mockConsole.mockClear();
    mockFile.mockClear();
    mockLogger.add.mockClear();
    
    // Удаляем кэш модуля логгера, чтобы он загружался заново при каждом тесте
    delete require.cache[require.resolve('../../../shared/utils/logger')];
  });

  afterEach(() => {
    // Восстанавливаем оригинальные методы
    winston.createLogger = originalCreateLogger;
    winston.format = originalFormat;
    winston.transports = originalTransports;
  });

  it('should create a logger with correct configuration', () => {
    // Act - импортируем модуль (который создает логгер)
    const { logger } = require('../../../shared/utils/logger');
    
    // Assert
    expect(mockCreateLogger).toHaveBeenCalled();
    expect(mockCreateLogger.mock.calls[0]?.[0]?.level).toBe(config.LOG_LEVEL);
    expect(mockFormatCombine).toHaveBeenCalled();
    expect(mockFormatTimestamp).toHaveBeenCalled();
    expect(mockFormatTimestamp.mock.calls[0]?.[0]).toEqual({ format: 'YYYY-MM-DD HH:mm:ss' });
    expect(mockFormatColorize).toHaveBeenCalled();
    expect(mockFormatPrintf).toHaveBeenCalled();
    expect(mockConsole).toHaveBeenCalled();
  });

  it('should not add file transports in development environment', () => {
    // Сохраняем оригинальное значение
    const origNodeEnv = config.NODE_ENV;
    (config as any).NODE_ENV = 'development';
    
    // Act - импортируем модуль (который создает логгер)
    const { logger } = require('../../../shared/utils/logger');
    
    // Assert
    expect(mockLogger.add).not.toHaveBeenCalled();
    
    // Восстанавливаем
    (config as any).NODE_ENV = origNodeEnv;
  });

  it('should configure logger in any environment', () => {
    // Сохраняем оригинальное значение
    const origNodeEnv = config.NODE_ENV;
    (config as any).NODE_ENV = 'production';
    
    // Act - импортируем модуль (который создает логгер)
    const { logger } = require('../../../shared/utils/logger');
    
    // Assert - просто проверяем, что логгер создан
    expect(mockCreateLogger).toHaveBeenCalled();
    
    // Восстанавливаем
    (config as any).NODE_ENV = origNodeEnv;
  });
}); 