import { EspecificacionModel } from "../Model/especificacion.js";

export class EspecificacionController {
    static async getEspByCodProd(req, res) {
        const { cod_prod } = req.params;
        try {
            const especificaciones = await EspecificacionModel.getEspByCodProd({ cod_prod });
            if (!especificaciones) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay especificaciones disponibles para este producto',
                });
            }
            return res.json(especificaciones);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener especificaciones de este producto',
            });
        }
    }

    static async create(req, res) {
        try {
            const { esp_titulo, cod_prod, nombres } = req.body; 
            if (!cod_prod || !esp_titulo) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El título y el código de producto son obligatorios',
                });
            }

            const especificacion = await EspecificacionModel.create({ esp_titulo, cod_prod });

            if (!especificacion) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la especificación',
                });
            }

            // Procesar nombres asociados si existen
            if (nombres && Array.isArray(nombres)) {
                for (const { nombre_titulo, nombre_descripcion } of nombres) {
                    if (nombre_titulo && nombre_descripcion) {
                        await EspecificacionModel.addNameAndDescription({
                            esp_id: especificacion.esp_id,
                            nombre_titulo,
                            nombre_descripcion,
                        });
                    }
                }
            }

            return res.status(201).json({
                status: 'success',
                especificacion,
            });
        } catch (error) {
            console.error('Error al crear la especificación:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear especificación',
            });
        }
    }

    static async delete(req, res) {
        const { esp_id } = req.params
        try {
            const success = await EspecificacionModel.delete({ esp_id })
            if (!success) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Especificacion no encontrado',
                })
            }
            return res.json({
                status: 'success',
                message: 'Especificacion eliminado correctamente',
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al eliminar especificacion',
            })
        }
    }
}
