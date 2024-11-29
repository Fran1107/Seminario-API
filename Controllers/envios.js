import { envioModel } from "../Model/envio.js";

export class envioController {
    static async create(req, res){
        try{
            const {local_codpostal, nro_factura, domic_id, costo} = req.body
            const response = await envioModel.create({local_codpostal, nro_factura, domic_id, costo})
            if(response){
                return res.status(201).json({
                    status: 'success',
                    response,
                });
            }else{
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al crear el envios',
                })
            }
        }catch(error){
            console.error('Error al crear el envios:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al generar el envios',
            });
        }

    }

    
    static async getEnvioByFac(req, res){
        const { nro_factura } = req.params
        try{
            const pedidoCliente = await envioModel.getEnvioByFac({nro_factura})
            if (!pedidoCliente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el envio del cliente',
                })
            }
            return res.json(pedidoCliente)
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el envio del cliente',
            })
        }
    }



}
