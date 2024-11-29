import { Router } from 'express'
import { DomicilioController } from '../Controllers/domicilios.js'

export const DomicilioRouter = Router()

DomicilioRouter.get('/:cli_cuil', DomicilioController.getDomicilioByClienteId)
DomicilioRouter.get('/getDom/:domic_id', DomicilioController.getDomicilioById)
DomicilioRouter.post('/create', DomicilioController.create) 