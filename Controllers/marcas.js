import { MarcaModel } from '../Model/marca.js'

export class MarcaController {
    static async getAll(req, res) {
        try {
            const marcas = await MarcaModel.getAll()
            if (!marcas) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay marcas disponibles',
                })
            }
            return res.json(marcas)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener marcas',
            })
        }
    }

    static async create(req, res) {
        try {
            const { marca_nombre, logo_url } = req.body;
            let marca = null;
    
            if (marca_nombre) {
                marca = await MarcaModel.create({ marca_nombre, logo_url});
            }
    
            if (marca) {
                return res.status(201).json({
                    status: 'success',
                    marca,
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la marca',
                });
            }
        } catch (error) {
            console.error('Error al crear marca:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear marca',
            });
        }
    }
}
