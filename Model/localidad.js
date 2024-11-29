import { connection } from '../Database/postgres.js'

export class LocalidadModel{
    static async getAll(){
        try {
            const res = await connection.query(`SELECT * FROM localidades`);
            return res.rows
        } catch (error) {
            console.error('Error al obtener localidades:', error)
            return false
        }
    }

    static async getById({ prov_id }) {
        try {
            const res = await connection.query(
                `
                SELECT * FROM localidades WHERE prov_id = $1
            `,
                [prov_id]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener localidad por ID:', error)
            return false
        }
    }
}