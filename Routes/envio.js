import { Router } from 'express'
import { envioController } from '../Controllers/envios.js'

export const enviosRouter = Router()

enviosRouter.post('/create', envioController.create)
enviosRouter.get('/:nro_factura', envioController.getEnvioByFac)