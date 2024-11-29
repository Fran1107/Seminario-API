import { Router } from 'express'
import passport from 'passport'
import { auth } from '../Middleware/auth.js'
import { ClienteController } from '../Controllers/clientes.js'

export const usersRouter = Router()

usersRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
usersRouter.get('/google/callback', passport.authenticate('google', {failureRedirect: 'http://localhost:5173/login'}), ClienteController.googleCallback)

usersRouter.get('/', ClienteController.getAll)
usersRouter.get('/profile',auth, ClienteController.profile)

usersRouter.post('/register', ClienteController.register)
usersRouter.post('/login', ClienteController.login)
usersRouter.post('/logout', ClienteController.logout)
usersRouter.get('/:id', ClienteController.getById)

usersRouter.patch('/update',auth, ClienteController.update)