import jwt from 'jsonwebtoken';
import { config } from '@config';
import { AccessTokenPayload, JwtPayload, RefreshTokenPayload } from '@shared/types/auth';

// Generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
  const accessPayload: AccessTokenPayload = {
    ...payload,
    type: 'access'
  };

  return jwt.sign(accessPayload, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRATION
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: JwtPayload, tokenId: string): string => {
  const refreshPayload: RefreshTokenPayload = {
    ...payload,
    type: 'refresh',
    tokenId
  };

  return jwt.sign(refreshPayload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRATION
  });
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