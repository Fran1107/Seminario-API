import { connection } from '../Database/postgres.js'

export class ClienteModel {
    static async getAll() {
        try {
            const res = await connection.query(`
                SELECT c.cli_cuil, c.cli_dni, c.nombre, c.cli_apellido, c.email, c.cli_telefono, 
                    r.rol_nombre as rol, p.prov_nombre as provincia
                FROM clientes c
                INNER JOIN roles r ON c.rol_id = r.rol_id
                INNER JOIN provincias p ON c.prov_id = p.prov_id;
            `)
            return res.rows
        } catch (error) {
            return false
        }
    }

    static async getById({ id }) {
        
        try {
            const res = await connection.query(
                `
                SELECT c.cli_cuil, c.cli_dni, c.nombre, c.cli_apellido, c.email, c.cli_telefono, 
                    r.rol_nombre as rol, p.prov_nombre as provincia
                FROM clientes c
                INNER JOIN roles r ON c.rol_id = r.rol_id
                INNER JOIN provincias p ON c.prov_id = p.prov_id
                WHERE c.cli_cuil = $1;
            `,
                [id]
            )
            console.log('oh',res)
            return res.rows[0]
        } catch (error) {
            return false
        }
    }

    static async create({ input }) {
        try {
            const {
                cli_cuil,
                cli_dni,
                nombre,
                cli_apellido,
                email,
                cli_contrasena,
                cli_telefono,
                prov_id,
                local_codpostal,
                rol_id,
            } = input
            const isUser = await connection.query(
                'SELECT * FROM clientes WHERE email = $1',
                [email]
            )

            if (isUser.rows.length != 0) {
                return false
            } else {
                const result = await connection.query(
                    `
                    INSERT INTO clientes (cli_cuil, cli_dni, nombre, cli_apellido, email, cli_contrasena, cli_telefono, prov_id, rol_id, local_codpostal)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `,
                    [
                        cli_cuil,
                        cli_dni,
                        nombre,
                        cli_apellido,
                        email,
                        cli_contrasena,
                        cli_telefono,
                        prov_id,
                        rol_id,
                        local_codpostal,
                    ]
                )
            }

            const user = await connection.query(
                'SELECT * FROM clientes WHERE email = $1',
                [email]
            )
            return user.rows[0]
        } catch (err) {
            console.log(err)
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
            
            const query = `UPDATE clientes SET ${setClause} WHERE email = $${
                fields.length + 1
            };`

            const res = await connection.query(query, values)
            if (res.rowCount == 0) {
                return false
            }
            
            const userEdited = await connection.query(
                `
                SELECT c.cli_cuil, c.cli_dni, c.nombre, c.cli_apellido, c.email, c.cli_telefono, p.prov_nombre as provincia, r.rol_nombre as rol
                FROM clientes c
                INNER JOIN roles r ON c.rol_id = r.rol_id
                INNER JOIN provincias p ON c.prov_id = p.prov_id
                WHERE c.email = $1;
            `,
                [id]
            )
            
            return userEdited.rows[0]
        } catch (error) {
            console.error('Error al actualizar el cliente:', error)
            return false
        }
    }

    static async delete({ id }) {
        try {
            const res = await connection.query(
                'DELETE FROM clientes WHERE cli_cuil = $1;',
                [id]
            )
            return res.rowCount > 0
        } catch (error) {
            console.error('Error al eliminar cliente:', error)
            return false
        }
    }

    static async getByGoogleId({ cli_googleId }) {
        
        try {
            const res = await connection.query(
                `SELECT * FROM clientes WHERE cli_googleId = $1`,
                [cli_googleId]
            )
            return res.rows[0]
        } catch (error) {
            return false
        }
    }
}
