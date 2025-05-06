import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { createUnauthorizedError, createForbiddenError } from '@shared/utils';
import { JwtPayload } from '@shared/types/auth';

// Define authenticated request interface
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Authentication middleware
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: JwtPayload) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(createUnauthorizedError('Unauthorized - Invalid token'));
    }

    req.user = user;
    return next();
  })(req, res, next);
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createUnauthorizedError('Unauthorized - Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createForbiddenError('Forbidden - Insufficient permissions'));
    }

    return next();
  };
}; 