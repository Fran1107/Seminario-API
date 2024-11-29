import { ConsultaModel } from "../Model/consulta.js";

export class ConsultaController { 
    static async getAll(req, res) {
        const { cod_prod } = req.params
        try {
            const consultas = await ConsultaModel.getAll(cod_prod)
            if (!consultas) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay consultas disponibles',
                })
            }
            return res.json(consultas)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener consultas',
            })
        }
    }

    static async createPregunta(req, res) {
        try {
            const { consulta_pregunta, cod_prod, cli_cuil } = req.body;
            let consulta = null;
    
            if (consulta_pregunta) {
                consulta = await ConsultaModel.createPregunta({ consulta_pregunta, cod_prod, cli_cuil });
            }
    
            if (consulta) {
                return res.status(201).json({
                    status: 'success',
                    consulta,
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la consulta',
                });
            }
        } catch (error) {
            console.error('Error al crear consulta:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear consulta',
            });
        }
    }

    static async createRespuesta(req, res) {
        try {
            const { consulta_id, consulta_respuesta, oper_cuil } = req.body;
            let respuesta = null;
    
            if (consulta_id) {
                respuesta = await ConsultaModel.createRespuesta({ consulta_id, consulta_respuesta, oper_cuil });
            }
    
            if (respuesta) {
                return res.status(201).json({
                    status: 'success',
                    respuesta,
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la respuesta',
                });
            }
        } catch (error) {
            console.error('Error al crear respuesta:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Error al crear respuesta',
            });
        }
    }

    static async getSinRespuesta(req, res) {
        try {
            const sinresp = await ConsultaModel.getSinRespuesta()
            if (!sinresp) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay consultas sin respuestas disponibles',
                })
            }
            return res.json(sinresp)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al obtener las consultas sin respuestas',
            })
        }
    }

}