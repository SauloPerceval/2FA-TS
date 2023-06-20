import express from 'express'
import {register, login} from '../controllers/auth'

var authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)

export {
    authRouter
}