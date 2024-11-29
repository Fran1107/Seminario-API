import { ClienteModel } from '../Model/cliente.js'
import { validatePartialUser, validateUser } from '../Schemas/users.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connection } from '../Database/postgres.js'
import { OperadorAdminModel } from '../Model/opadmin.js'

dotenv.config()

export class ClienteController {
    static async getAll(req, res) {
        try {
            const clientes = await ClienteModel.getAll()
            if (!clientes) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay clientes',
                })
            }
            return res.json(clientes)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer todos los clientes',
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params
        console.log('id',id)
        try {
            const cliente = await ClienteModel.getById({ id })
            console.log('asd',cliente)
            if (!cliente) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Cliente no encontrado',
                })
            }
            return res.json(cliente)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer el cliente',
            })
        }
    }

    static async register(req, res) {
        const result = validateUser(req.body)
        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message),
            })
        }

        const { data } = result

        try {
            const hashPassword = await bcrypt.hash(
                data.cli_contrasena,
                parseInt(process.env.SALT_ROUNDS)
            )
            data.cli_contrasena = hashPassword
            const cliente = await ClienteModel.create({ input: data })
            if (!cliente) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El cliente con este email ya existe!',
                })
            }

            const { cli_contrasena, ...publicUser } = cliente
            return res.status(201).json({
                status: 'success',
                user: publicUser,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al registrar cliente',
            })
        }
    }

    static login = async (req, res) => {
        const { email, contrasena } = req.body; 
        const userRoles = [
            { table: 'clientes', role: 'Cliente', cuilField: 'cli_cuil' },
            { table: 'operadores', role: 'Operador', cuilField: 'oper_cuil' },
            { table: 'administradores', role: 'Admin', cuilField: 'admin_cuil' },
        ];
    
        try {
            for (const { table, role, cuilField } of userRoles) {
                if(role == 'Cliente'){
                    const result = await connection.query(
                        `SELECT ${cuilField}, nombre, cli_apellido, cli_dni, email, contrasena, cli_telefono, p.prov_nombre AS provincia, rol_id FROM ${table} c INNER JOIN provincias p ON c.prov_id = p.prov_id 
                        WHERE email like $1;`,
                        [email]
                    );
                    if (result.rows.length > 0) {
                        const isValid = await bcrypt.compare(contrasena, result.rows[0].contrasena);
                        if (isValid) {
                            const user = { ...result.rows[0], rol: role };
                            return this.generateTokenAndRespond(res, user);
                        }
                    }
                } else if (role == 'Operador'){
                    const result = await connection.query(
                        `SELECT ${cuilField}, nombre, email, contrasena, rol_id FROM ${table} WHERE email like $1;`,
                        [email]
                    );
                    if (result.rows.length > 0) {
                        const isValid = await bcrypt.compare(contrasena, result.rows[0].contrasena);
                        if (isValid) {
                            const user = { ...result.rows[0], rol: role };
                            return this.generateTokenAndRespond(res, user);
                        }
                    }
                }else if (role == 'Admin'){
                    const result = await connection.query(
                        `SELECT ${cuilField}, nombre, email, contrasena, rol_id FROM ${table} WHERE email like $1;`,
                        [email]
                    );
                    if (result.rows.length > 0) {
                        const isValid = await bcrypt.compare(contrasena, result.rows[0].contrasena);
                        if (isValid) {
                            const user = { ...result.rows[0], rol: role };
                            return this.generateTokenAndRespond(res, user);
                        }
                    }
                }
                
            }
    
            return res.status(400).json({
                status: 'error',
                error: 'El usuario es incorrecto o no existe',
                message: 'El email ingresado es incorrecto o no existe',
            });
        } catch (error) {
            console.error('Error en el inicio de sesión:', error); 
            return res.status(500).json({
                status: 'error',
                error: 'Error en el inicio de sesión',
            });
        }
    }
    
    
    static generateTokenAndRespond (res, user) {
        const token = jwt.sign({ user }, process.env.TOP_SECRET, { expiresIn: '24h' });
        return res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60,
            })
            .json({
                status: 'success',
                user,
            });
    };
    

    static async logout(req, res) {
        res.clearCookie('access_token').json({
            status: 'success',
            message: 'Sesión finalizada correctamente',
        })
    }

    static async update(req, res) {
        const result = validatePartialUser(req.body)
        
        const { email } = req.body

        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message),
            })
        }

        const { data } = result
        

        try {
            const clienteEditado = await ClienteModel.update({
                id: email,
                input: data,
            })
            if (!clienteEditado) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el clientess1',
                })
            }

            return res.json({
                status: 'success',
                user: clienteEditado,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al actualizar cliente',
            })
        }
    }

    static async googleCallback(req, res) {
        try {
            const token = jwt.sign({ user: req.user }, process.env.TOP_SECRET, {
                expiresIn: '24h',
            })

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == 'production', 
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'lax', //24h
            })

            res.cookie('user', JSON.stringify(req.user), {
                httpOnly: false, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24, // 1 día
                sameSite: 'lax',
            })

            res.redirect('http://localhost:5173/')
        } catch (error) {
            console.log(error)
            res.status(500).send('Error al autenticar con Google')
        }
    }

    static async profile(req, res) {
        const { id } = req.auth

        if (!id) {
            return res.status(400).json({
                status: 'error',
                error: 'Acceso no autorizado',
            })
        }

        try {
            const cliente = await ClienteModel.getById({ id })

            if (!cliente) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Cliente no encontrado',
                })
            }

            return res.json({
                status: 'success',
                user: cliente,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer el perfil del cliente',
            })
        }
    }
}
