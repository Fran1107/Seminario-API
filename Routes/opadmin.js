import { Router } from 'express'
import passport from 'passport'
import { auth } from '../Middleware/auth.js'
import { OperadorAdminController } from '../Controllers/opsadmin.js'

export const adminRouter = Router()

adminRouter.get('/', OperadorAdminController.getAll)
adminRouter.post('/register', OperadorAdminController.register)