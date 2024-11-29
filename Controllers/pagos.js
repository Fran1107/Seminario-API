import { pagoModel } from "../Model/pago.js";

export class pagoController {
    static async create(req, res){
        try{
            const {metpago_id, nro_factura} = req.body

            const response = await pagoModel.create({metpago_id, nro_factura})
            if (response) {
                return res.status(201).json({
                    status: 'success',
                    response,
                });
                
            }else{
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al crear el pago',
                })
            }

        }catch(error){
            console.error('Error al crear el pago:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al generar el pago',
            });
        }
    }

    static async getPago(req, res){
        const { nro_factura } = req.params
        try{
            const pago = await pagoModel.getPago({nro_factura})
            if (!pago) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el pago',
                })
            }
            return res.json(pago)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el pago',
            })
        }
    }

    static async editarEstado(req, res){
        const { nro_factura } = req.params
        const { estado } = req.body
        try{
            const pagoEstado = await pagoModel.editarEstado({nro_factura, estado})
            if (!pagoEstado) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al editar pago el pedido del cliente',
                })
            }
            return res.json(pagoEstado)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al editar pago el pedido del cliente',
            })
        }
    }
}