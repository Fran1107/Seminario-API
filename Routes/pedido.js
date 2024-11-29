import { Router } from 'express'
import { pedidoController } from '../Controllers/pedidos.js'

export const pedidosRouter = Router()

pedidosRouter.get('/getAll', pedidoController.getAll)
pedidosRouter.get('/getPedido/:pedido_id', pedidoController.getPedido)
pedidosRouter.get('/:nro_factura', pedidoController.getPedidoById)
pedidosRouter.post('/create', pedidoController.create)
pedidosRouter.patch('/asignarOperador/:pedido_id', pedidoController.asignarOperador)
pedidosRouter.patch('/editarEstado/:pedido_id', pedidoController.editarEstado)