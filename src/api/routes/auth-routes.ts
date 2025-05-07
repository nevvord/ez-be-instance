import { Router } from 'express';
import { authenticate, validate } from '@api/middlewares';
import { asHandler, asAuthHandler } from '@api/middlewares/controller-types';
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
router.post('/auth.register', validate(registerSchema), asHandler(register));

// Login user
router.post('/auth.login', validate(loginSchema), asHandler(login));

// Refresh token
router.post('/auth.refresh', validate(refreshTokenSchema), asHandler(refresh));

// Logout user (requires authentication)
router.post('/auth.logout', authenticate, asAuthHandler(logout));

// Get current user (requires authentication)
router.get('/auth.me', authenticate, asAuthHandler(getCurrentUser)); 