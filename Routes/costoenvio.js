import { Router } from 'express'
import { CostoEnvioController } from '../Controllers/costos_envios.js'

export const costoenvioRouter = Router()

costoenvioRouter.get('/getCosto/:prov_id', CostoEnvioController.getCostoByProvinciaId)
