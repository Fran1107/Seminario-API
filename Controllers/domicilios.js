import { DomicilioModel } from "../Model/domicilio.js";

export class DomicilioController {
    static async getDomicilioByClienteId(req, res){
        const { cli_cuil } = req.params; 

        try {
            const domi = await DomicilioModel.getDomicilioByClienteId({ cli_cuil });
            if (!domi) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el domicilio',
                });
            }
            return res.json(domi);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el domicilio',
            });
        }
    }

    
    static async getDomicilioById(req, res){
        const { domic_id } = req.params; 

        try {
            const domi = await DomicilioModel.getDomicilioById({ domic_id });
            if (!domi) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el domicilio del envio',
                });
            }
            return res.json(domi);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el domicilio del envio',
            });
        }
    }

    static async create(req, res){
        const {cli_cuil, calle, numero, piso, dpto} = req.body
        
        try{
            const domic = await DomicilioModel.create({ cli_cuil, calle, numero, piso, dpto })
            if (!domic) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al crear el domicilio',
                });
            }
            return res.json(domic);
        }catch(error){
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear el domicilio',
            });
        }

    }


}