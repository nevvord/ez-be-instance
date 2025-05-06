import { Router } from 'express';
import { authenticate, validate } from '@api/middlewares';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  getCurrentUser 
} from '@api/controllers/auth-controller';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenSchema 
} from '@api/validators/auth-validator';

export const router = Router();

// Routes follow pattern: entity.action
// Register a new user
router.post('/auth.register', validate(registerSchema), register);

// Login
router.post('/auth.login', validate(loginSchema), login);

// Refresh token
router.post('/auth.refresh', validate(refreshTokenSchema), refresh);

// Logout
router.post('/auth.logout', logout);

// Get current user (protected route)
router.get('/auth.me', authenticate, getCurrentUser); 