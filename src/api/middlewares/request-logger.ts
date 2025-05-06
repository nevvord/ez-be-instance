import { Request, Response, NextFunction } from 'express';
import { logger } from '@shared/utils';

// Log request details
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // Log request start
  logger.info(`Request started: ${method} ${originalUrl}`, {
    ip,
    userAgent: req.get('user-agent'),
    body: method !== 'GET' ? req.body : undefined
  });

  // Log request completion and timing after response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Use appropriate log level based on status code
    const logMethod = statusCode >= 500 
      ? 'error' 
      : statusCode >= 400 
        ? 'warn' 
        : 'info';

    logger[logMethod](`Request completed: ${method} ${originalUrl}`, {
      statusCode,
      duration: `${duration}ms`,
      ip
    });
  });

  next();
}; 