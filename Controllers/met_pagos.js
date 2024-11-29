import { MetPagoModel } from "../Model/met_pago.js";

export class MetPagoController {

    static async getAll(req, res) {
        try {
            const metpago = await MetPagoModel.getAll()
            if (!metpago) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay metodos de pago disponibles',
                })
            }
            return res.json(metpago)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener metodo de pagos',
            })
        }
    }

    static async getMetodoPago (req, res) {
        const { metpago_id } = req.params;
        try{
            const metpago = await MetPagoModel.getMetodoPago({ metpago_id });
            if (!metpago) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el metodo de pago ',
                });
            }
            return res.json(metpago);
        }catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el metodo de pago',
            });
        }
    }

}