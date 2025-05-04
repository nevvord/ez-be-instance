import type { Request, Response, NextFunction } from 'express';
import { createSuccessResponse, createZodValidationError } from '@shared/types';
import { getUserInfoSchema, createUserSchema } from '../validators';
import type { GetUserInfoBody, CreateUserBody } from '../validators';
import { userService } from '@services/index';

/**
 * Get user information by ID
 */
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = getUserInfoSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw createZodValidationError(validation.error);
    }

    const { id } = validation.data;

    // Call user service to get user data
    const user = await userService.getUserById(id);

    // Return successful response
    res.json(createSuccessResponse(user));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = createUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw createZodValidationError(validation.error);
    }

    const userData = validation.data;

    // Call user service to create user
    const user = await userService.createUser(userData);

    // Return successful response
    res.status(201).json(createSuccessResponse(user));
  } catch (error) {
    next(error);
  }
}; 