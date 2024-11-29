import { connection } from '../Database/postgres.js'


export class ImgProductModel {
    static async addImage({ cod_prod, url }) {
        try {
            const res = await connection.query(`
                INSERT INTO imagenes_productos (cod_prod, url_imagen)
                VALUES ($1, $2)
                RETURNING *;
            `, [cod_prod, url])
            return res.rows[0]
        } catch (error) {
            console.error('Error al agregar imagen:', error)
            return false
        }
    }

    static async getImagesByProductId({ cod_prod }) {
        try {
            const res = await connection.query(`
                SELECT url_imagen, imgprod_id, hidden
                FROM imagenes_productos
                WHERE cod_prod = $1;
            `, [cod_prod])
            return res.rows
        } catch (error) {
            console.error('Error al obtener imágenes:', error)
            return false
        }
    }

    static async toggleImageVisibility({ imgprod_id, hidden }) {

        try {
            const res = await connection.query(`
                UPDATE imagenes_productos
                SET hidden = $1
                WHERE imgprod_id = $2
                RETURNING *;
            `, [hidden, imgprod_id]);
            return res.rows[0]; 
        } catch (error) {
            console.error('Error al actualizar visibilidad de imagen:', error);
            return false;
        }
    }
    
}

