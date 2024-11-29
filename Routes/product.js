import { Router } from 'express';
import { ProductController } from '../Controllers/products.js';
import { auth } from '../Middleware/auth.js';

export const productsRouter = Router();

productsRouter.patch('/habilitar', ProductController.updateHabilitar); 
productsRouter.get('/', ProductController.getAll);
productsRouter.get('/search', ProductController.search); 
productsRouter.get('/:id', ProductController.getById);
productsRouter.post('/create', ProductController.create); //auth
productsRouter.patch('/update/:id', ProductController.update);  //auth
productsRouter.delete('/delete/:id', ProductController.delete); //auth?
