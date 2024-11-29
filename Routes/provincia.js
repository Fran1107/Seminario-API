import { Router } from 'express';
import { ProvinciaController } from '../Controllers/provincias.js'; 
import { auth } from '../Middleware/auth.js';

export const provinciasRouter = Router();

provinciasRouter.get('/', ProvinciaController.getAll)