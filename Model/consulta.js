import { connection } from '../Database/postgres.js'

export class ConsultaModel {
    static async getAll(cod_prod) {
        try {
            const res = await connection.query(`SELECT * FROM consultas where cod_prod = $1`, [cod_prod])
            return res.rows
        } catch (error) {
            console.error('Error al obtener las consultas del producto:', error)
            return false
        }
    }

    static async createPregunta({consulta_pregunta, cod_prod, cli_cuil}) {
        try{
            const res = await connection.query(`
                INSERT INTO consultas (consulta_fechapreg, consulta_pregunta, cod_prod, cli_cuil) VALUES (now(), $1, $2, $3)
                RETURNING *;
                `,
            [consulta_pregunta, cod_prod, cli_cuil]
            )
            return res.rows[0]

        }catch(error){
            console.error('Error al crear la consulta:', error)
            return false
        }
    }

    static async createRespuesta({consulta_id, consulta_respuesta, oper_cuil}) {
        try{
            const res = await connection.query(`
                UPDATE consultas
                SET consulta_respuesta = $1, consulta_fecharesp = NOW(), oper_id = $3
                WHERE consulta_id = $2
                RETURNING *;
                `,
                [consulta_respuesta, consulta_id, oper_cuil]
            )
            return res.rows[0]

        }catch(error){
            console.error('Error al crear la respuesta de la consulta:', error)
            return false
        }
    }

    static async getSinRespuesta() {
        try {
            const res = await connection.query(`
                SELECT consulta_pregunta, consulta_fechapreg, cod_prod, cli_cuil
                FROM consultas
                WHERE consulta_respuesta IS NULL`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener las consultas del producto:', error)
            return false
        }
    }



}
