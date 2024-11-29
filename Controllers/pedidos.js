import { pedidoModel } from "../Model/pedido.js";

export class pedidoController {

    static async getAll(req, res) {
        try {
            const pedidos = await pedidoModel.getAll()
            if (!pedidos) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay pedidos disponibles',
                })
            }
            return res.json(pedidos)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener pedidos',
            })
        }
    }

    static async getPedido(req, res){
        const { pedido_id } = req.params
        try{
            const pedido = await pedidoModel.getPedido({pedido_id})
            if (!pedido) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el pedido del cliente',
                })
            }
            return res.json(pedido)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el pedido del cliente',
            })
        }
    }

    static async getPedidoById(req, res){
        const { nro_factura } = req.params
        try{
            const pedidoCliente = await pedidoModel.getPedidoById({nro_factura})
            if (!pedidoCliente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el pedido del cliente',
                })
            }
            return res.json(pedidoCliente)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el pedido del cliente',
            })
        }
    }

    static async create(req, res){
        try {
            const {nro_factura} = req.body
            const response = await pedidoModel.create({nro_factura})
            if(response){
                return res.status(201).json({
                    status: 'success',
                    response,
                });
            }else{
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al crear el pedido',
                })
            }
        }catch(error){
            console.error('Error al crear el pedido:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al generar el pedido',
            });
        }
    }

    static async asignarOperador(req, res){
        const { pedido_id } = req.params
        const { oper_id } = req.body
        try{
            const pedidoOper = await pedidoModel.asignarOperador({pedido_id, oper_id})
            if (!pedidoOper) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el pedido del cliente',
                })
            }
            return res.json(pedidoOper)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el pedido del cliente',
            })
        }
    }

    static async editarEstado(req, res){
        const { pedido_id } = req.params
        const { estado } = req.body
        try{
            const pedidoEstado = await pedidoModel.editarEstado({pedido_id, estado})
            if (!pedidoEstado) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al editar estado el pedido del cliente',
                })
            }
            return res.json(pedidoEstado)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al editar el estado del pedido del cliente',
            })
        }
    }
}