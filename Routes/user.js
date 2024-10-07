import { Router } from 'express'
import { UserController } from '../Controllers/users.js'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAll)

usersRouter.post('/register', UserController.register)
usersRouter.post('/login', UserController.login)
