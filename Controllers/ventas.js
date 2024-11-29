import { VentaModel } from '../Model/venta.js'
import { email } from '../Config/email.js'

export class VentaController {
    static async getAll(req, res) {
        try {
            const ventas = await VentaModel.getAll()
            if (!ventas) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay ventas disponibles',
                })
            }
            return res.json(ventas)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener ventas',
            })
        }
    }

    static async create(req, res) {
        const { cli_cuil, venta_total, cartItems } = req.body;

        if (!cli_cuil || !venta_total || !cartItems) {
            return res.status(400).json({
                status: 'error',
                error: 'Faltan datos necesarios para realizar la venta',
            });
        }

        try {
            // Iniciar la transacción
            const venta = await VentaModel.createVentaWithDetails(cli_cuil, venta_total, cartItems);

            if (venta) {
                return res.status(201).json({
                    status: 'success',
                    venta,
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la venta',
                });
            }
        } catch (error) {
            console.error('Error al crear venta:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear venta',
            });
        }
    }

    static async getVentaById(req, res) {
        const { cli_cuil } = req.params
        try {
            const ventaCliente = await VentaModel.getVentaById({ cli_cuil })
            if (!ventaCliente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener la venta del cliente',
                })
            }
            return res.json(ventaCliente)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener la venta del cliente',
            })
        }
    }

    static async getVentaByFac(req, res) {
        const { nro_factura } = req.params
        try {
            const facCliente = await VentaModel.getVentaByFac({ nro_factura })
            if (!facCliente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener la factura del cliente',
                })
            }
            return res.json(facCliente)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener la factura del cliente',
            })
        }
    }

    static async getDetVenta(req, res) {
        const { nro_factura } = req.params
        try {
            const facCliente = await VentaModel.getDetVenta({ nro_factura })
            if (!facCliente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener la factura del cliente',
                })
            }
            return res.json(facCliente)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener la factura del cliente',
            })
        }
    }

    static async sendEmail(req, res) {
        const { subject, text } = req.body;

        try {
            let info = await email(subject, text);
            res.status(200).json({
                status: 'success',
                message: `Email sent: ${info.response}`
            });
        } catch (error) {
            res.status(500).send("Error sending email");
        }
    }
}
