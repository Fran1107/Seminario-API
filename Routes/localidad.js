import { Router } from 'express';
import { LocalidadController } from '../Controllers/localidades.js'; 
import { auth } from '../Middleware/auth.js';

export const localidadesRouter = Router();

localidadesRouter.get('/', LocalidadController.getAll)
localidadesRouter.get('/:prov_id', LocalidadController.getById) 