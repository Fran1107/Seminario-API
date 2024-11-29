import { connection } from '../Database/postgres.js';

export class EspecificacionModel {
    static async getEspByCodProd({ cod_prod }) {
        try {
            const res = await connection.query(`
                SELECT 
                    e.esp_id, 
                    e.esp_titulo, 
                    e.cod_prod, 
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'nombre_id', n.nombre_id,
                            'nombre_titulo', n.nombre_titulo,
                            'nombre_descripcion', n.nombre_descripcion
                        )
                    ) AS nombres
                FROM especificaciones e
                LEFT JOIN esp_x_nombre n ON e.esp_id = n.esp_id
                WHERE e.cod_prod = $1
                GROUP BY e.esp_id;
            `, [cod_prod]);
            return res.rows;
        } catch (error) {
            console.error('Error al obtener las especificaciones de este producto:', error);
            return false;
        }
    }

    static async create({ esp_titulo, cod_prod }) {
        try {
            const res = await connection.query(`
                INSERT INTO especificaciones (esp_titulo, cod_prod) 
                VALUES ($1, $2) 
                RETURNING *;
            `, [esp_titulo, cod_prod]);
            return res.rows[0];
        } catch (error) {
            console.error('Error al crear la especificación:', error);
            return false;
        }
    }

    static async addNameAndDescription({ esp_id, nombre_titulo, nombre_descripcion }) {
        try {
            const res = await connection.query(`
                INSERT INTO esp_x_nombre (nombre_titulo, nombre_descripcion, esp_id) 
                VALUES ($1, $2, $3) 
                RETURNING *;
            `, [nombre_titulo, nombre_descripcion, esp_id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error al agregar título y descripción a la especificación:', error);
            return false;
        }
    }

    static async delete({ esp_id }) {
        const client = await connection.connect();
        try {
            // Iniciar una transacción
            await client.query('BEGIN');
    
            // Ejecutar las dos consultas
            const res1 = await client.query(
                'DELETE FROM esp_x_nombre WHERE esp_id = $1', 
                [esp_id]
            );
            
            const res2 = await client.query(
                'DELETE FROM especificaciones WHERE esp_id = $1', 
                [esp_id]
            );
    
            // Confirmar la transacción
            await client.query('COMMIT');
    
            // Verificar si al menos una fila fue afectada
            return res1.rowCount > 0 || res2.rowCount > 0;
        } catch (error) {
            // Si hay un error, hacer rollback para revertir cualquier cambio
            await client.query('ROLLBACK');
            console.error('Error al eliminar especificación:', error);
            return false;
        } finally {
            // Liberar la conexión
            client.release();
        }
    }
    


}
