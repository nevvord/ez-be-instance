import { Response, NextFunction } from 'express';
import { AuthRequest } from '@api/middlewares/auth-middleware';
import * as authService from '@services/auth-service';
import { prisma } from '@db';

// Get all active sessions for the current user
export const getUserSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }
    
    // Get active sessions from database
    const sessions = await authService.getActiveSessions(req.user.userId);
    
    return res.status(200).json({
      status: 'success',
      data: { sessions }
    });
  } catch (error) {
    return next(error);
  }
};

// Terminate a specific session
export const terminateSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }
    
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        status: 'error',
        code: 'SESSION_ID_REQUIRED',
        message: 'Session ID is required'
      });
    }
    
    // Verify the session belongs to the user
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
        userId: req.user.userId
      }
    });
    
    if (!session) {
      return res.status(404).json({
        status: 'error',
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found or does not belong to user'
      });
    }
    
    // Terminate the session by setting expiration to now
    await prisma.session.update({
      where: {
        id: sessionId
      },
      data: {
        expiresAt: new Date()
      }
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Session terminated successfully'
    });
  } catch (error) {
    return next(error);
  }
};

// Terminate all sessions except current one
export const terminateAllSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }
    
    // Extract IP and user agent to identify current session
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    
    // Find current session by user information
    const currentSession = await prisma.session.findFirst({
      where: {
        userId: req.user.userId,
        ipAddress,
        userAgent,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Terminate all other sessions
    await prisma.session.updateMany({
      where: {
        userId: req.user.userId,
        id: currentSession ? { not: currentSession.id } : undefined,
        expiresAt: {
          gt: new Date()
        }
      },
      data: {
        expiresAt: new Date()
      }
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'All other sessions terminated successfully'
    });
  } catch (error) {
    return next(error);
  }
}; 