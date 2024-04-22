import { Router } from "express"
import authController from "../controller/authController"

const authRouter = Router()

authRouter.post('/registration', authController.registration)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.get('/activate/:link', authController.activate)
authRouter.get('/refresh', authController.refresh)

export default authRouter