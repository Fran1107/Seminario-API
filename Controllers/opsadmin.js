import { OperadorAdminModel } from '../Model/opadmin.js'
import { validateOper, validatePartialOper } from '../Schemas/opadmin.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotenv.config()

export class OperadorAdminController {
    static async getAll(req, res) {
        try {
            const usuarios = await OperadorAdminModel.getAll()
            if (!usuarios) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay operadores o administradores',
                })
            }
            return res.json(usuarios)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer los operadores o administradores',
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params
        try {
            const usuario = await OperadorAdminModel.getById({ id })
            if (!usuario) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Usuario no encontrado',
                })
            }
            return res.json(usuario)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer el usuario',
            })
        }
    }

    static async register(req, res) {
        const result = req.body
        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message),
            })
        }
        const { data } = result
        try {
            const hashPassword = await bcrypt.hash(
                result.contrasena,
                parseInt(process.env.SALT_ROUNDS)
            )
            result.contrasena = hashPassword
            const usuario = await OperadorAdminModel.create({
                input: result,
                role: result.rol_id,
            })
            if (!usuario) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El usuario ya existe',
                })
            }

            const { contrasena, ...publicUser } = usuario
            return res.status(201).json({
                status: 'success',
                user: publicUser,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al registrar usuario',
            })
        }
    }

    static async login(req, res) {
        const result = validatePartialOper(req.body)
        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message),
            })
        }

        const { email, contrasena } = result.data

        try {
            const usuario = await OperadorAdminModel.login({ email })
            if (!usuario) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Usuario incorrecto o no existe',
                })
            }

            const isValid = await bcrypt.compare(contrasena, usuario.contrasena)

            if (!isValid) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Contraseña incorrecta',
                })
            }

            const { contrasena: _, ...publicUser } = usuario

            const token = jwt.sign(
                { user: publicUser },
                process.env.TOP_SECRET,
                { expiresIn: '24h' }
            )

            return res
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV == 'production',
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60,
                })
                .json({
                    status: 'success',
                    user: publicUser,
                })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error en el inicio de sesión',
            })
        }
    }

    static async logout(req, res) {
        res.clearCookie('access_token').json({
            status: 'success',
            message: 'Sesión finalizada correctamente',
        })
    }

    static async update(req, res) {
        const result = validatePartialOper(req.body)
        const { oper_cuil } = req.auth

        if (result.error) {
            return res.status(400).json({
                status: "error",
                error: JSON.parse(result.error.message),
            })
        }

        const { data } = result

        try {
            const usuarioEditado = await OperadorAdminModel.update({ id: oper_cuil, input: data })
            if (!usuarioEditado) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el usuario',
                })
            }

            return res.json({
                status: 'success',
                user: usuarioEditado,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al actualizar usuario',
            })
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
            const usuario = await OperadorAdminModel.getById({ id })

            if (!usuario) {
                return res.status(404).json({
                    status: 'error',
                    error: 'Usuario no encontrado',
                })
            }

            return res.json({
                status: 'success',
                user: usuario,
            })
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer el perfil del usuario',
            })
        }
    }
}
