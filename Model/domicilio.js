import { connection } from '../Database/postgres.js'

export class DomicilioModel {
    static async getAll() {
        try {
            const res = await connection.query(`SELECT * FROM domicilio`)
            return res.rows
        } catch (error) {
            console.error('Error al obtener domicilios:', error)
            return false
        }
    }

    static async getDomicilioByClienteId({ cli_cuil }) {
        try {
            const res = await connection.query(`
                SELECT d.domic_id, d.cli_cuil, c.cli_cuil , d.calle, d.numero, d.piso, d.dpto 
                FROM domicilio d 
                INNER JOIN clientes c ON c.cli_cuil = d.cli_cuil
                WHERE c.cli_cuil = $1;
            `, [cli_cuil]);
            return res.rows;
        } catch (error) {
            console.error('Error al obtener el domicilio:', error);
            return false;
        }
    }

    static async getDomicilioById({ domic_id }) {
        try {
            const res = await connection.query(`
                SELECT domic_id, cli_cuil , calle, numero, piso, dpto 
                FROM domicilio 
                WHERE domic_id = $1;
            `, [domic_id]);
            return res.rows;
        } catch (error) {
            console.error('Error al obtener el domicilio del envio:', error);
            return false;
        }
    }

    static async create({cli_cuil, calle, numero, piso, dpto}){
        try{
            const res = await connection.query(`
                INSERT INTO domicilio (cli_cuil, calle, numero, piso, dpto) VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
                `,
            [cli_cuil, calle, numero, piso, dpto ]
            )
            return res.rows[0]
        }catch(error){
            console.error('Error al crear el envios:', error)
            return false
        }
    }


}