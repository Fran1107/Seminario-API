import { LocalidadModel } from "../Model/localidad.js" 

export class LocalidadController{
    static async getAll(req, res){
        try {
            const localidades = await LocalidadModel.getAll()
            if (!localidades) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay localidades disponibles',
                })
            }
            return res.json(localidades)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener localidades',
            })
        }
    }

    static async getById(req, res) {
        const { prov_id } = req.params
        try {
            const localidad = await LocalidadModel.getById({ prov_id })
            if (!localidad) {
                return res.status(404).json({
                    status: 'error',
                    error: 'localidad no encontrado',
                })
            }
            return res.json(localidad)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener localidad',
            })
        }
    }
}