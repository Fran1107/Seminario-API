import { connection } from '../Database/postgres.js'

export class envioModel{
    static async create({local_codpostal, nro_factura, domic_id, costo}){
        try{
            const res = await connection.query(`
                INSERT INTO envios (local_codpostal, domic_id, nro_factura, costo) VALUES ($1, $2, $3, $4)
                RETURNING *;
                `,
            [local_codpostal, domic_id, nro_factura, costo ]
            )
            return res.rows[0]
        }catch(error){
            console.error('Error al crear el envios:', error)
            return false
        }
    }

    static async getEnvioByFac({nro_factura}){

        try{
            const res = await connection.query(`
                SELECT * FROM envios WHERE nro_factura = $1
                `,
            [nro_factura])
            return res.rows

        }catch(error){
            console.error('Error al obtener el pedido del cliente:', error)
            return false
        }
    }

    

}