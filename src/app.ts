import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { logger } from './shared/utils';
import { prisma } from './db';
import { errorHandler, requestLogger } from './api/middlewares';
import { router as apiRoutes } from './api/routes';

// Function to create Express application
export const createApp = () => {
  const app = express();
  const httpServer = createServer(app);

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // In production, specify exact domains
      methods: ['GET', 'POST'],
    },
  });

  // Setup middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger); // Add request logging

  // Basic health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Connect API routes
  app.use('/api', apiRoutes);

  // Error handling middleware should be last
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
  });

  // Handle Socket.io connections
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return { app, httpServer, io };
};

// Function to start the server
export const startServer = async () => {
  const { httpServer } = createApp();

  try {
    // Check database connection if not in development mode or DATABASE_URL is provided
    if (config.NODE_ENV !== 'development' || process.env.DATABASE_URL) {
      try {
        await prisma.$connect();
        logger.info('Connected to database');
      } catch (error) {
        if (config.NODE_ENV === 'development') {
          logger.warn('Failed to connect to database in development mode, continuing without database...');
        } else {
          throw error;
        }
      }
    } else {
      logger.warn('Running in development mode without database connection');
    }

    // Start HTTP server
    httpServer.listen(config.PORT, () => {
      logger.info(`Server is running on http://${config.HOST}:${config.PORT}`);
    });

    return httpServer;
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
export const setupGracefulShutdown = () => {
  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
  });
}; 