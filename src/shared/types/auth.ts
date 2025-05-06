import { User } from '@prisma/client';

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
};

export type AccessTokenPayload = JwtPayload & {
  type: 'access';
};

export type RefreshTokenPayload = JwtPayload & {
  type: 'refresh';
  tokenId: string;
};

export interface AuthUser extends Omit<User, 'password'> {}

export interface TokenResponse {
  user: AuthUser;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type RefreshRequest = {
  refreshToken?: string;
}; 