import { connection } from '../Database/postgres.js'

export class CategoriaModel {
    static async getAll() {
        try {
            const res = await connection.query(`SELECT * FROM categorias`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener categorias:', error)
            return false
        }
    }
    static async create({cat_nombre, url}) {
        try{
            const res = await connection.query(`
                INSERT INTO categorias (cat_nombre, url) VALUES ($1, $2)
                RETURNING *;
                `,
            [cat_nombre, url]
            )
            return res.rows[0]

        }catch(error){
            console.error('Error al crear categoria:', error)
            return false
        }
    }
}
