import { connection } from '../Database/postgres.js'

export class UserModel {
    static async getAll() {
        try {
            const res = await connection.query(
                'select u.usu_id,u.nombre, u.apellido, u.email, r.nombre as rol from usuarios u inner join roles r on u.rol_id = r.rol_id;'
            )
            return res.rows
        } catch (error) {
            return false
        }
    }

    static async getById({ id }) {
        try {
            const res = await connection.query(
                'select usu_id, nombre, apellido, email, contrasena from usuarios where usu_id = $1',
                [id]
            )
            return res.rows[0]
        } catch (error) {
            return false
        }
    }

    static async create({ input }) {
        try {
            const { nombre, apellido, email, contrasena } = input
            const isUser = await connection.query(
                'select * from usuarios where email like $1',
                [email]
            )

            if (isUser.rows.length != 0) {
                return false
            } else {
                const res = await connection.query(
                    'insert into usuarios(nombre,apellido,email,contrasena) values ($1, $2, $3, $4)',
                    [nombre, apellido, email, contrasena]
                )

                const user = await connection.query(
                    'select * from usuarios where email like $1',
                    [email]
                )
                return user.rows[0]
            }

        } catch (err) {
            console.log(err)
            return false
        }
    }

    static async login({ email }){
        try{
            const res = await connection.query('select u.usu_id, u.nombre, u.apellido, u.email, u.contrasena, r.nombre as rol from usuarios u inner join roles r on u.rol_id = r.rol_id  where u.email like $1', [email])
            if(res.rows.length == 0){ return false }
            return res.rows[0]
        }catch(error){
            return false
        }
    }

    static async delete({ id }) {}

    static async update({ id, input }) {
        const fields = Object.keys(input)
        const values = Object.values(input)

        if(fields.length === 0) {return false}

        try{
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')
            values.push(id)

            const query = `UPDATE usuarios SET ${setClause} WHERE id = $${fields.length + 1}`

            const res = await connection.query(query, values)
            const userEdited = await connection.query('select u.usu_id, u.nombre, u.apellido, u.email, u.contrasena, r.nombre as rol from usuarios u inner join roles r on u.usu_id = r.rol_id where u.usu_id = $1', [id])

            if(res.rowCount == 0){
                return false
            }

            return userEdited.rows[0]
        }catch (error){
            return false
        }

    }
}
