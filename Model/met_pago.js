import { connection } from '../Database/postgres.js'

export class MetPagoModel {

    static async getAll(){
        try {
            const res = await connection.query(`SELECT * FROM metodos_pago`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener los metodos de pago:', error)
            return false
        }
    }

    static async getMetodoPago({ metpago_id }) {
        try {
            const res = await connection.query(`
                select descripcion 
                from metodos_pago where metpago_id = $1;
            `, [metpago_id])
            return res.rows
        } catch (error) {
            console.error('Error al obtener el metpago por id:', error)
            return false
        }
    }

}