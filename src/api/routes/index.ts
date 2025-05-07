import { Router } from 'express';
import { router as authRoutes } from './auth-routes';
import { router as sessionRoutes } from './session-routes';

// Create main router
export const router = Router();

// Register route modules
router.use(authRoutes);
router.use(sessionRoutes);
