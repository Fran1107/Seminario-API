import { connection } from '../Database/postgres.js'

export class ProductModel {
    static async getAll() {
        try {
            const res = await connection.query(`
                SELECT p.cod_prod, p.prod_nombre, p.prod_precio, p.prod_descripcion, p.prod_stock, p.prod_destacado, p.habilitar,
                    MIN(ip.url_imagen) AS url_imagen,  -- Selecciona una imagen (puede ser MIN o MAX)
                    c.cat_nombre AS categoria, 
                    m.marca_nombre  AS marca 
                FROM productos p
                INNER JOIN categorias c ON p.cat_id = c.cat_id
                INNER JOIN marcas m ON p.marca_id = m.marca_id
                LEFT JOIN imagenes_productos ip 
                ON p.cod_prod = ip.cod_prod AND ip.hidden = false  
                GROUP BY p.cod_prod, p.prod_nombre, p.prod_precio, p.prod_descripcion, p.prod_stock, p.habilitar, c.cat_nombre, m.marca_nombre;
            `)
            return res.rows
        } catch (error) {
            console.error('Error al obtener productos:', error)
            return false
        }
    }

    static async getById({ id }) {
        try {
            const res = await connection.query(
                `
                SELECT p.cod_prod, p.prod_nombre, p.prod_precio, p.prod_descripcion, p.prod_stock, p.prod_destacado, p.habilitar,
                    c.cat_nombre AS categoria, m.marca_nombre AS marca,MIN(ip.url_imagen) AS url_imagen
                FROM productos p
                INNER JOIN categorias c ON p.cat_id = c.cat_id
                INNER JOIN marcas m ON p.marca_id = m.marca_id
                LEFT JOIN imagenes_productos ip ON p.cod_prod = ip.cod_prod
                WHERE p.cod_prod = $1
                group by p.cod_prod, p.habilitar, c.cat_nombre, m.marca_nombre;  
            `,
                [id]
            )
            return res.rows[0]
        } catch (error) {
            console.error('Error al obtener producto por ID:', error)
            return false
        }
    }

    static async create({ input }) {
        try {
            const {
                cod_prod,
                prod_nombre,
                prod_precio,
                prod_descripcion,
                prod_stock,
                cat_id,
                marca_id,
                prod_destacado,
                habilitar,
            } = input
            const res = await connection.query(
                `
                INSERT INTO productos (cod_prod, prod_nombre, prod_precio, prod_descripcion, prod_stock, cat_id, marca_id, prod_destacado, habilitar)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `,
                [
                    cod_prod,
                    prod_nombre,
                    prod_precio,
                    prod_descripcion,
                    prod_stock,
                    cat_id,
                    marca_id,
                    prod_destacado,
                    habilitar,
                ]
            )
            return res.rows[0]
        } catch (error) {
            console.error('Error al crear producto:', error)
            return false
        }
    }

    static async update({ id, input }) {
        const fields = Object.keys(input)
        const values = Object.values(input)
        if (fields.length === 0) {
            return false
        }

        try {
            const setClause = fields
                .map((field, index) => `${field} = $${index + 1}`)
                .join(', ')
            values.push(id)
            const query = `UPDATE productos SET ${setClause} WHERE cod_prod = $${
                fields.length + 1
            };`

            const res = await connection.query(query, values)
            if (res.rowCount === 0) {
                return false
            }
            return await ProductModel.getById({ id })
        } catch (error) {
            console.error('Error al actualizar producto:', error)
            return false
        }
    }

    static async delete({ id }) {
        try {
            const res = await connection.query(
                'DELETE FROM productos WHERE cod_prod = $1;',
                [id]
            )
            return res.rowCount > 0
        } catch (error) {
            console.error('Error al eliminar producto:', error)
            return false
        }
    }

    static async getByCategory({ categoryId }) {
        try {
            const res = await connection.query(
                `
                SELECT p.cod_prod, p.prod_nombre, p.prod_precio, p.prod_descripcion, p.prod_stock, 
                    c.cat_nombre AS categoria, m.marca_nombre AS marca 
                FROM productos p
                INNER JOIN categorias c ON p.cat_id = c.cat_id
                INNER JOIN marcas m ON p.marca_id = m.marca_id
                WHERE p.cat_id = $1;
            `,
                [categoryId]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error)
            return false
        }
    }

    static async getByBrand({ brandId }) {
        try {
            const res = await connection.query(
                `
                SELECT p.cod_prod, p.prod_nombre, p.prod_precio, p.prod_descripcion, p.prod_stock, 
                    c.cat_nombre AS categoria, m.marca_nombre AS marca 
                FROM productos p
                INNER JOIN categorias c ON p.cat_id = c.cat_id
                INNER JOIN marcas m ON p.marca_id = m.marca_id
                WHERE p.marca_id = $1;
            `,
                [brandId]
            )
            return res.rows
        } catch (error) {
            console.error('Error al obtener productos por marca:', error)
            return false
        }
    }

    static async searchProducts(searchTerm, limit) {
        try {
            const res = await connection.query(
                `
                SELECT p.cod_prod, p.prod_nombre, p.prod_precio, p.prod_descripcion, p.prod_stock, p.habilitar,
                    MIN(ip.url_imagen) AS url_imagen, 
                    c.cat_nombre AS categoria, 
                    m.marca_nombre AS marca 
                FROM productos p
                INNER JOIN categorias c ON p.cat_id = c.cat_id
                INNER JOIN marcas m ON p.marca_id = m.marca_id
                LEFT JOIN imagenes_productos ip ON p.cod_prod = ip.cod_prod and ip.hidden = 'false'
                WHERE LOWER(p.prod_nombre) LIKE LOWER($1 || '%') 
                GROUP BY p.cod_prod, p.habilitar, c.cat_nombre, m.marca_nombre
                LIMIT $2;
            `,
                [`${searchTerm}`, limit]
            )

            return res.rows
        } catch (error) {
            console.error('Error al buscar productos:', error)
            return false
        }
    }

    static async updateHabilitar({ cod_prod, habilitar }) {
        try {
            const res = await connection.query(
                `UPDATE productos SET habilitar = $1 WHERE cod_prod = $2;`,
                [habilitar, cod_prod]
            )

            return res.rows
        } catch (error) {
            console.error('Error al habilitar o deshabilitar producto', error)
        }
    }
}
