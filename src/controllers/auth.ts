import {Request, Response} from 'express'
import {userCreator, findUser} from '../models/users'

async function register(req: Request, res: Response, next: Function) {
    let user = await userCreator(req.body.username, req.body.password);

    res.json({secret: user.otpSecret});
    next();
}

async function login(req: Request, res: Response, next: Function) {
    let user = await findUser(req.body.username);

    if (user != null && await user.checkPassword(req.body.password) && user.checkOtpToken(req.body.token)) {
        res.json({message: "Logged in!"});
    } else {
        res.status(401).json({message: "Invalid login"});
    }
    next();
}

export {
    register,
    login
}