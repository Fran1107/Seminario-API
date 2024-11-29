import { Router } from 'express'
import { MarcaController } from '../Controllers/marcas.js'

export const marcasRouter = Router()

marcasRouter.get('/', MarcaController.getAll)
marcasRouter.post('/create', MarcaController.create)
