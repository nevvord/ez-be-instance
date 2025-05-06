import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { prisma } from '@db';
import { createAppError } from '@shared/utils/error-factory';
import { generateAccessToken, generateRefreshToken } from '@shared/utils/token-utils';
import { JwtPayload, LoginRequest, RegisterRequest } from '@shared/types/auth';
import { User } from '@prisma/client';

// Create a new user (register)
export const registerUser = async (data: RegisterRequest) => {
  const { email, password, firstName, lastName } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw createAppError('User already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName
    }
  });

  // Remove sensitive data
  const { password: _, ...userData } = user;

  return userData;
};

// Login user
export const loginUser = async (data: LoginRequest, ipAddress?: string, userAgent?: string) => {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw createAppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createAppError('Invalid email or password', 401);
  }

  // Create token payload
  const tokenPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  // Create token
  return createTokens(user, tokenPayload, ipAddress, userAgent);
};

// Create tokens (access and refresh)
export const createTokens = async (
  user: User,
  payload: JwtPayload,
  ipAddress?: string,
  userAgent?: string
) => {
  // Generate access token
  const accessToken = generateAccessToken(payload);

  // Generate refresh token id
  const tokenId = randomUUID();

  // Generate refresh token
  const refreshToken = generateRefreshToken(payload, tokenId);

  // Calculate expiration date (7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId: user.id,
      token: refreshToken,
      expiresAt,
      ipAddress,
      userAgent
    }
  });

  // Remove sensitive data
  const { password: _, ...userData } = user;

  return {
    accessToken,
    refreshToken,
    user: userData
  };
};

// Refresh token
export const refreshToken = async (token: string, ipAddress?: string, userAgent?: string) => {
  // Find token in database
  const refreshTokenRecord = await prisma.refreshToken.findFirst({
    where: {
      token,
      isValid: true,
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  });

  if (!refreshTokenRecord) {
    throw createAppError('Invalid refresh token', 401);
  }

  // Invalidate old token
  await prisma.refreshToken.update({
    where: {
      id: refreshTokenRecord.id
    },
    data: {
      isValid: false
    }
  });

  // Create token payload
  const tokenPayload: JwtPayload = {
    userId: refreshTokenRecord.user.id,
    email: refreshTokenRecord.user.email,
    role: refreshTokenRecord.user.role
  };

  // Create new tokens
  return createTokens(refreshTokenRecord.user, tokenPayload, ipAddress, userAgent);
};

// Logout user
export const logoutUser = async (token: string) => {
  // Invalidate refresh token
  await prisma.refreshToken.updateMany({
    where: {
      token,
      isValid: true
    },
    data: {
      isValid: false
    }
  });

  return { success: true };
}; 