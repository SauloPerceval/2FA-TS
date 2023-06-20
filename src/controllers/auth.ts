import {Request, Response} from 'express'
import { authenticator } from 'otplib';
import {User} from '../models/users'

async function register(req: Request, res: Response, next: Function) {
    let user = await User.create({username: req.body.username, password: req.body.password, otpSecret: authenticator.generateSecret()});

    res.json({secret: user.otpSecret});
    next();
}

async function login(req: Request, res: Response, next: Function) {
    let user = await User.findOne({ where: {username: req.body.username}});

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