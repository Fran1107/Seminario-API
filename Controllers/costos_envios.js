import { CostoEnvioModel } from "../Model/costo_envio.js";

export class CostoEnvioController {
    static async getCostoByProvinciaId (req, res) {
        const { prov_id } = req.params;
        try{
            const costobyprov = await CostoEnvioModel.getCostoByProvinciaId({ prov_id });
            if (!costobyprov) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Error al obtener el costo por provincia ',
                });
            }
            return res.json(costobyprov);
        }catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener el costo por provincia',
            });
        }

    }
}