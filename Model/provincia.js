import { connection } from '../Database/postgres.js'

export class ProvinciaModel{
    static async getAll(){
        try {
            const res = await connection.query(`SELECT * FROM provincias`);
            return res.rows
        } catch (error) {
            console.error('Error al obtener provincias:', error)
            return false
        }
    }
}