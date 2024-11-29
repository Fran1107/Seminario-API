import { Router } from 'express'
import { VentaController } from '../Controllers/ventas.js'

export const ventasRouter = Router()

ventasRouter.get('/', VentaController.getAll)
ventasRouter.get('/:cli_cuil', VentaController.getVentaById)
ventasRouter.get('/getFac/:nro_factura', VentaController.getVentaByFac)
ventasRouter.get('/detVenta/:nro_factura', VentaController.getDetVenta)
ventasRouter.post('/create', VentaController.create)
ventasRouter.post('/sendEmail', VentaController.sendEmail) 