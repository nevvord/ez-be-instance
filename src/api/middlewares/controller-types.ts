import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from './auth-middleware';

// Типы для контроллеров
export type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export type AuthControllerFunction = (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>;

// Хелпер для преобразования AuthRequest в Request для корректной типизации роутеров
export const asHandler = (fn: ControllerFunction): ControllerFunction => fn;
export const asAuthHandler = (fn: AuthControllerFunction): ControllerFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req as AuthRequest, res, next);
  };
}; 