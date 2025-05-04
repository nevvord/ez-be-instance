import winston from 'winston';
import { config } from '@config/index';

// Create console format for logs
const createConsoleFormat = () => {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}] ${level}: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`;
    })
  );
};

// Create logger instance
const createLogger = () => {
  const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: createConsoleFormat(),
    transports: [new winston.transports.Console()],
  });

  // In production environment, we can add additional transports
  if (config.NODE_ENV === 'production') {
    // Example: add file logging
    // logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    // logger.add(new winston.transports.File({ filename: 'combined.log' }));
  }

  return logger;
};

// Export logger instance
export const logger = createLogger(); 