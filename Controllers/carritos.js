import { CarritoModel } from "../Model/carrito.js";

export class CarritoController {
    static async getCart(req, res) {
        const { cli_cuil } = req.params; 

        try {
            const cartItems = await CarritoModel.getCartByClienteId({ cli_cuil });
            if (!cartItems) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el carrito',
                });
            }
            return res.json(cartItems);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el carrito',
            });
        }
    }

    static async addToCart(req, res) {
        
        const { cli_cuil, cod_prod, cantidad } = req.body;
        try {
            const itemAdded = await CarritoModel.addToCart({ cli_cuil, cod_prod, cantidad });
            if (!itemAdded) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al agregar el producto al carrito',
                });
            }
            // Obtener todos los productos del carrito para el cliente
            const carritoCompleto = await CarritoModel.getCartByClienteId({ cli_cuil })
            return res.json(carritoCompleto); 
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al agregar el producto al carrito',
            });
        }
    }

    static async updateQuantity(req, res) {
        const { cli_cuil, cod_prod, cantidad } = req.body;
    
        try {
            const itemUpdated = await CarritoModel.updateQuantity({ cli_cuil, cod_prod, cantidad });
            if (!itemUpdated) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al actualizar la cantidad en el carrito',
                });
            }
            
            // Obtener todos los productos del carrito para el cliente
            const carritoCompleto = await CarritoModel.getCartByClienteId({ cli_cuil })
            return res.json(carritoCompleto); 
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al actualizar la cantidad en el carrito',
            });
        }
    }
    

    static async removeFromCart(req, res) {
        const { cli_cuil,cod_prod } = req.body;

        try {
            const itemRemoved = await CarritoModel.removeFromCart({ cli_cuil, cod_prod });
            if (!itemRemoved) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al eliminar el producto del carrito',
                });
            }
            return res.json({ status: 'success', message: 'Producto eliminado del carrito' });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al eliminar el producto del carrito',
            });
        }
    }

    static async clearCart(req, res) {
        const { cli_cuil } = req.params;

        try {
            const cartCleared = await CarritoModel.clearCart({ cli_cuil });
            if (!cartCleared) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al vaciar el carrito',
                });
            }
            return res.json({ status: 'success', message: 'Carrito vaciado' });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al vaciar el carrito',
            });
        }
    }
}
