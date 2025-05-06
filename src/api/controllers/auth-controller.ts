import { Request, Response, NextFunction } from 'express';
import { config } from '@config';
import * as authService from '@services/auth-service';
import { LoginRequest, RegisterRequest } from '@shared/types/auth';
import { AuthRequest } from '@api/middlewares/auth-middleware';
import { prisma } from '@db';

// Cookie options for access and refresh tokens
const getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: config.COOKIE_SECURE,
  sameSite: config.COOKIE_SAME_SITE,
  maxAge: 15 * 60 * 1000, // 15 minutes
  domain: config.COOKIE_DOMAIN
});

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: config.COOKIE_SECURE,
  sameSite: config.COOKIE_SAME_SITE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth.refresh', // Only send to refresh endpoint
  domain: config.COOKIE_DOMAIN
});

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: RegisterRequest = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    // Create user account
    const newUser = await authService.registerUser(userData);
    
    // Create token payload and generate tokens
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
    
    const { accessToken, refreshToken, user } = await authService.createTokens(
      { ...newUser, password: '' }, // Create a User object that satisfies the type
      tokenPayload, 
      ipAddress, 
      userAgent
    );
    
    // Set cookies
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
    
    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: { user }
    });
  } catch (error) {
    return next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials: LoginRequest = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    
    // Authenticate user and generate tokens
    const { accessToken, refreshToken, user } = await authService.loginUser(
      credentials, 
      ipAddress, 
      userAgent
    );
    
    // Set cookies
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
    
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: { user }
    });
  } catch (error) {
    return next(error);
  }
};

// Refresh tokens
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        code: 'REFRESH_TOKEN_REQUIRED',
        message: 'Refresh token is required'
      });
    }
    
    // Refresh tokens
    const { accessToken, refreshToken, user } = await authService.refreshToken(
      token, 
      ipAddress, 
      userAgent
    );
    
    // Set cookies
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
    
    return res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: { user }
    });
  } catch (error) {
    return next(error);
  }
};

// Logout user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    
    if (token) {
      // Invalidate token in database
      await authService.logoutUser(token);
    }
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    return next(error);
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Not authenticated'
      });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Remove sensitive data
    const { password, ...userData } = user;
    
    return res.status(200).json({
      status: 'success',
      data: { user: userData }
    });
  } catch (error) {
    return next(error);
  }
}; 