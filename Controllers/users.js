import { UserModel } from '../Model/user.js'
import { validatePartialUser, validateUser } from '../Schemas/users.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotenv.config()

export class UserController {
    
    static async getAll(req, res) {
        try {
            const users = await UserModel.getAll()
            if (!users) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No hay usuarios',
                })
            }
            return res.json(users)
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Error al traer todos los usuarios',
            })
        }
    }

    static async getById(req, res) {}

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
                data.contrasena,
                parseInt(process.env.SALT_ROUNDS)
            )
            data.contrasena = hashPassword
            const user = await UserModel.create({ input: data })

            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El usuario ingresado ya existe!',
                })
            }

            const { password, ...publicUser } = user
            return res.status(201).json({
                status: 'success',
                user: publicUser,
            })
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error: 'error controller usersregister.js',
            })
        }
    }

    static async login(req, res) {
        const result = validatePartialUser(req.body)
        if (result.error) {
            return result.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message),
            })
        }
        const { email, contrasena } = result.data

        try {
            const user = await UserModel.login({ email })
            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El usuario es incorrecto o no existe',
                })
            }

            const isValid = await bcrypt.compare(contrasena, user.contrasena)

            if (!isValid) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Contraseña incorrecta',
                })
            }

            const { contrasena: _, ...publicUser } = user

            const token = jwt.sign({user: publicUser }, process.env.TOP_SECRET, { expiresIn: '24h'})

            return res.cookie('access_token', token, {
                httpOnly: true, // la cookie solo se puede acceder en el servidor (no desde js)
                secure: process.env.NODE_ENV == 'production', // la cookie solo se puede acceder en https
                sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
                maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
            })
                .json({
                    status: 'success',
                    user: publicUser,
                })
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error: 'error controller userslogin.js',
            })
        }
    }

    static async update(req, res) {
        const result = validatePartialUser(req.body)
        const { id } = req.auth

        if(result.error){
            return res.status(400).json({
                status: "error",
                error: JSON.parse(result.error.message)
            })
        }
        const { data } = result

        try{
            const userEdited = await UserModel.update({id, input: data})

            if(!userEdited){
                return res.status(400).json({
                    status: "error",
                    error: 'Ya existe ese email'
                })
            }

            return res.json({
                status: 'success',
                user: userEdited
            })
        }catch (error){
            return res.status(500).json({
                status: "error",
                error: "Vaya algo salió mal!"
            })
        }
    }
}
