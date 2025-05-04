import { Router } from 'express';
import { getUserInfo, createUser } from '../controllers';

export const routes = Router();

// Example request: POST /users.getInfo with id in request body
routes.post('/users.getInfo', getUserInfo);

// Example request: POST /users.create with user data in request body
routes.post('/users.create', createUser); 