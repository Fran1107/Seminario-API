import { connection } from '../Database/postgres.js'

export class CarritoModel {
    static async getCartByClienteId({ cli_cuil }) {
        try {
            const res = await connection.query(
                `
                SELECT DISTINCT ON (p.cod_prod) 
                    p.cod_prod, p.prod_nombre, p.prod_stock, MIN(i.url_imagen) AS url_imagen, 
                    c.cantidad, p.prod_precio, 
                       (p.prod_precio * c.cantidad) AS total
                FROM carrito c
                INNER JOIN productos p ON c.cod_prod = p.cod_prod
                LEFT JOIN imagenes_productos i ON p.cod_prod = i.cod_prod
                WHERE c.cli_cuil = $1
                group by p.cod_prod, c.cantidad;
            `,
                [cli_cuil]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener el carrito:', error)
            return false
        }
    }

    static async addToCart({ cli_cuil, cod_prod, cantidad }) {
        try {
            const res = await connection.query(
                `
                INSERT INTO carrito (cli_cuil, cod_prod, cantidad)
                VALUES ($1, $2, $3)
                ON CONFLICT (cli_cuil, cod_prod)
                DO UPDATE SET cantidad = carrito.cantidad + $3
                RETURNING *;
            `,
                [cli_cuil, cod_prod, cantidad]
            )
            return res.rows[0]
        } catch (error) {
            console.error('Error al agregar al carrito:', error)
            return false
        }
    }

    static async updateQuantity({ cli_cuil, cod_prod, cantidad }) {
        try {
            const res = await connection.query(
                `
                UPDATE carrito
                SET cantidad = $3
                WHERE cli_cuil = $1 AND cod_prod = $2
                RETURNING *;
            `,
                [cli_cuil, cod_prod, cantidad]
            )
            
            return res.rows[0]
        } catch (error) {
            console.error(
                'Error al actualizar la cantidad en el carrito:',
                error
            )
            return false
        }
    }

    static async removeFromCart({ cli_cuil, cod_prod }) {
        try {
            const res = await connection.query(
                `
                DELETE FROM carrito
                WHERE cli_cuil = $1 AND cod_prod = $2;
            `,
                [cli_cuil, cod_prod]
            )
            return res.rowCount > 0
        } catch (error) {
            console.error('Error al eliminar del carrito:', error)
            return false
        }
    }

    static async clearCart({ cli_cuil }) {
        try {
            const res = await connection.query(
                `
                DELETE FROM carrito WHERE cli_cuil = $1;
            `,
                [cli_cuil]
            )
            return res.rowCount > 0
        } catch (error) {
            console.error('Error al vaciar el carrito:', error)
            return false
        }
    }
}
