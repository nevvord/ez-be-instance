import { z } from 'zod';

/**
 * Schema for validating user info request
 */
export const getUserInfoSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Type for validated getUserInfo request body
 */
export type GetUserInfoBody = z.infer<typeof getUserInfoSchema>;

/**
 * Schema for validating user creation request
 */
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

/**
 * Type for validated createUser request body
 */
export type CreateUserBody = z.infer<typeof createUserSchema>; 