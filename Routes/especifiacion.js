import { Router } from 'express'
import { EspecificacionController } from '../Controllers/especificaciones.js'

export const espRouter = Router()

espRouter.get(
    '/getEspecificacion/:cod_prod',
    EspecificacionController.getEspByCodProd
)
espRouter.post('/create', EspecificacionController.create)
espRouter.delete('/delete/:esp_id', EspecificacionController.delete)
