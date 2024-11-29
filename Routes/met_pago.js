import { Router } from 'express'
import { MetPagoController } from '../Controllers/met_pagos.js'

export const MetPagoRouter = Router()

MetPagoRouter.get('/', MetPagoController.getAll)
MetPagoRouter.get('/:metpago_id', MetPagoController.getMetodoPago) 