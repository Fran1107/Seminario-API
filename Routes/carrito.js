import { Router } from 'express'
import { CarritoController } from '../Controllers/carritos.js'

export const carritoRouter = Router()

carritoRouter.get('/getCart/:cli_cuil', CarritoController.getCart)
carritoRouter.post('/addToCart', CarritoController.addToCart)
carritoRouter.patch('/updateQuantity', CarritoController.updateQuantity)
carritoRouter.delete('/removeFromCart', CarritoController.removeFromCart)
carritoRouter.delete('/clearCart/:cli_cuil', CarritoController.clearCart)