import { Router } from 'express';
import { authenticate } from '@api/middlewares';
import { asAuthHandler } from '@api/middlewares/controller-types';
import { 
  getUserSessions, 
  terminateSession, 
  terminateAllSessions 
} from '@api/controllers/session-controller';

export const router = Router();

// Get user sessions
router.get('/sessions.list', authenticate, asAuthHandler(getUserSessions));

// Terminate a specific session
router.post('/sessions.terminate', authenticate, asAuthHandler(terminateSession));

// Terminate all sessions except current
router.post('/sessions.terminateAll', authenticate, asAuthHandler(terminateAllSessions)); 