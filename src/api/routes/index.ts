import { Router } from 'express';
import { router as authRoutes } from './auth-routes';

// Create main router
export const router = Router();

// Register route modules
router.use(authRoutes);
