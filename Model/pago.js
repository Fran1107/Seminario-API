import { connection } from '../Database/postgres.js'

export class pagoModel{
    static async create({metpago_id, nro_factura}){
        try{
            const res = await connection.query(`
                INSERT INTO pagos (pago_fecha, pago_estado, metpago_id, nro_factura) VALUES (now(), 'Pendiente' , $1, $2)
                RETURNING *;
                `,
            [metpago_id, nro_factura ]
            )
            return res.rows[0]
        }catch(error){
            console.error('Error al crear el pago:', error)
            return false
        }
    }

    static async getPago({nro_factura}){

        try{
            const res = await connection.query(`
                SELECT * FROM pagos WHERE nro_factura = $1
                `,
            [nro_factura])
            return res.rows

        }catch(error){
            console.error('Error al obtener el pago:', error)
            return false
        }
    }

    static async editarEstado({ estado, nro_factura }) {
        try {
            const res = await connection.query(
                `
                UPDATE pagos
                SET pago_estado = $1
                WHERE nro_factura = $2;
                `,
                [estado, nro_factura]
            )
            return res.rows
        } catch (error) {
            console.error('Error al editar el estado de pago del pedido:', error)
            return false
        }
    }

}
