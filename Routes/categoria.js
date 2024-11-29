import { Router } from 'express'
import { CategoriaController } from '../Controllers/categorias.js'

export const categoriasRouter = Router()

categoriasRouter.get('/', CategoriaController.getAll)
categoriasRouter.post('/create', CategoriaController.create)
