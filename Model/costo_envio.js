import { connection } from '../Database/postgres.js'

export class CostoEnvioModel {

    static async getCostoByProvinciaId({ prov_id }) {
        try {
            const res = await connection.query(`
                select costoenv_id, costo 
                from costos_envio where prov_id = $1;
            `, [prov_id])
            return res.rows
        } catch (error) {
            console.error('Error al obtener el costo por provincia id:', error)
            return false
        }
    }
}