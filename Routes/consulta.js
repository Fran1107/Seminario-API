import { Router } from 'express'
import { ConsultaController } from '../Controllers/consultas.js'

export const consultaRouter = Router()

consultaRouter.get('/sinrespuesta', ConsultaController.getSinRespuesta)
consultaRouter.get('/:cod_prod', ConsultaController.getAll)
consultaRouter.post('/create', ConsultaController.createPregunta)
consultaRouter.post('/createRespuesta', ConsultaController.createRespuesta)