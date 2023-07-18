import express from 'express'
import {register, login, retrieverOtpToken, validate2FA, checkLogin} from '../controllers/auth'

var authRouter = express.Router()

authRouter.post('/register', register)
authRouter.get('/token', retrieverOtpToken)
authRouter.post('/token/validate', validate2FA)
authRouter.post('/login', login)
authRouter.get('/logged', checkLogin)

export {
    authRouter
}