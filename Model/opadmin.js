import { connection } from '../Database/postgres.js'

export class OperadorAdminModel {
    static async getAll() {
        try {
            const res = await connection.query(`
                SELECT o.oper_cuil, o.nombre, o.oper_apellido, o.email, o.oper_telefono, 
                    r.rol_nombre as rol
                FROM operadores o
                INNER JOIN roles r ON o.rol_id = r.rol_id
            `);
            return res.rows;
        } catch (error) {
            return false;
        }
    }

    static async getById({ id }) {
        try {
            const res = await connection.query(`
                SELECT o.oper_cuil, o.nombre, o.oper_apellido, o.oper_email, o.oper_telefono, 
                    r.rol_nombre as rol
                FROM operadores o
                INNER JOIN roles r ON o.rol_id = r.rol_id
                WHERE o.oper_cuil = $1
                UNION
                SELECT a.admin_cuil, a.nombre, a.apellido, a.email, NULL as telefono, r.rol_nombre as rol
                FROM administradores a
                INNER JOIN roles r ON a.rol_id = r.rol_id
                WHERE a.admin_cuil = $1;
            `, [id]);
            return res.rows[0];
        } catch (error) {
            return false;
        }
    }


    static async create({ input, role }) {
        try {
            console.log('model',input)
            console.log('rol model',role)
            if (role == '2') {
                console.log('entro al if 1')
                const { oper_cuil, oper_telefono, nombre, oper_apellido, email, contrasena, rol_id } = input;
                const result = await connection.query(`
                    INSERT INTO operadores (oper_cuil, nombre, oper_apellido, email, contrasena, oper_telefono, rol_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
                `, [oper_cuil, nombre, oper_apellido, email, contrasena, oper_telefono, rol_id]);
                console.log('modelresultrow',result.rows[0])
                return result.rows[0];
            } else if(role == '3') {
                console.log('entro al if 2')
                const { admin_cuil, nombre, apellido, email, contrasena, rol_id } = input;
                const result = await connection.query(`
                    INSERT INTO administradores (admin_cuil, nombre, apellido, email, contrasena, rol_id)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
                `, [admin_cuil, nombre, apellido, email, contrasena, rol_id]);
                console.log('entro model admin')
                return result.rows[0];
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async update({ id, input }) {
        const fields = Object.keys(input);
        const values = Object.values(input);

        if (fields.length === 0) {
            return false;
        }

        try {
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
            values.push(id);

            const queryOperadores = `UPDATE operadores SET ${setClause} WHERE oper_cuil = $${fields.length + 1};`;
            const queryAdministradores = `UPDATE administradores SET ${setClause} WHERE admin_cuil = $${fields.length + 1};`;

            const resOperadores = await connection.query(queryOperadores, values);
            const resAdministradores = await connection.query(queryAdministradores, values);

            if (resOperadores.rowCount == 0 && resAdministradores.rowCount == 0) {
                return false;
            }

            const userEdited = await connection.query(`
                SELECT o.oper_cuil, o.nombre, o.oper_apellido, o.oper_email, o.oper_telefono, r.rol_nombre as rol
                FROM operadores o
                INNER JOIN roles r ON o.rol_id = r.rol_id
                WHERE o.oper_cuil = $1
                UNION
                SELECT a.admin_cuil, a.nombre, a.apellido, a.email, NULL as telefono, r.rol_nombre as rol
                FROM administradores a
                INNER JOIN roles r ON a.rol_id = r.rol_id
                WHERE a.admin_cuil = $1;
            `, [id]);

            return userEdited.rows[0];
        } catch (error) {
            console.error('Error al actualizar operador/administrador:', error);
            return false;
        }
    }

    static async delete({ id }) {
        try {
            const resOperadores = await connection.query('DELETE FROM operadores WHERE oper_cuil = $1;', [id]);
            const resAdministradores = await connection.query('DELETE FROM administradores WHERE admin_cuil = $1;', [id]);

            return resOperadores.rowCount > 0 || resAdministradores.rowCount > 0;
        } catch (error) {
            console.error('Error al eliminar operador/administrador:', error);
            return false;
        }
    }
}
