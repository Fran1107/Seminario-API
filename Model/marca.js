import { connection } from '../Database/postgres.js'

export class MarcaModel {
    static async getAll() {
        try {
            const res = await connection.query(`SELECT * FROM marcas`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener marcas:', error)
            return false
        }
    }

    static async create({marca_nombre, logo_url}) {
        try{
            const res = await connection.query(`
                INSERT INTO marcas (marca_nombre, logo_url) VALUES ($1, $2)
                RETURNING *;
                `,
            [marca_nombre, logo_url]
            )
            return res.rows[0]

        }catch(error){
            console.error('Error al crear la marca:', error)
            return false
        }
    }
}
