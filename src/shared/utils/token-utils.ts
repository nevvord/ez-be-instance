import jwt from 'jsonwebtoken';
import { config } from '@config';
import { AccessTokenPayload, JwtPayload, RefreshTokenPayload } from '@shared/types/auth';

// Определим тип StringValue для jwt.sign
type StringValue = string & { __brand: 'StringValue' };

// Generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
  const accessPayload: AccessTokenPayload = {
    ...payload,
    type: 'access'
  };

  // Использую any для обхода проблем с типизацией
  return jwt.sign(accessPayload, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRATION
  } as any);
};

// Generate refresh token
export const generateRefreshToken = (payload: JwtPayload, tokenId: string): string => {
  const refreshPayload: RefreshTokenPayload = {
    ...payload,
    type: 'refresh',
    tokenId
  };

  // Использую any для обхода проблем с типизацией
  return jwt.sign(refreshPayload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRATION
  } as any);
};

// Verify access token
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as AccessTokenPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}; 