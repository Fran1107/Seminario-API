import { ProvinciaModel } from "../Model/provincia.js";

export class ProvinciaController{
    static async getAll(req, res){
        try {
            const provincias = await ProvinciaModel.getAll()
            if (!provincias) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay provincias disponibles',
                })
            }
            return res.json(provincias)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener provincias',
            })
        }
    }
}