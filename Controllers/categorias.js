import { CategoriaModel } from '../Model/categoria.js'

export class CategoriaController {
    static async getAll(req, res) {
        try {
            const categorias = await CategoriaModel.getAll()
            if (!categorias) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay categorias disponibles',
                })
            }
            return res.json(categorias)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener categorias',
            })
        }
    }

    static async create(req, res) {
        try {
            const { cat_nombre, url } = req.body;
            let categoria = null;
    
            if (cat_nombre) {
                categoria = await CategoriaModel.create({ cat_nombre, url });
            }
    
            if (categoria) {
                return res.status(201).json({
                    status: 'success',
                    categoria,
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la categoría',
                });
            }
        } catch (error) {
            console.error('Error al crear categoría:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear categoria',
            });
        }
    }
    
}
