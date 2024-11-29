import { Router } from 'express'
import { pagoController } from '../Controllers/pagos.js'

export const pagosRouter = Router()

pagosRouter.post('/', pagoController.create)
pagosRouter.get('/getPago/:nro_factura', pagoController.getPago)
pagosRouter.patch('/estado/:nro_factura', pagoController.editarEstado)