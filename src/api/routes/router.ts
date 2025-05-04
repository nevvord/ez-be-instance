import { Router } from 'express';
import { routes as exampleRoutes } from './example-routes';

// Create main router
export const router = Router();

// Connect all routes here
router.use(exampleRoutes); 