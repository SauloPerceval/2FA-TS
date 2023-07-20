import {Request, Response} from 'express'
import {userCreator, findUser} from '../models/users'


declare module "express-session" {
    interface SessionData {
      username: string;
      validated2FA: boolean;
    }
  }

async function register(req: Request, res: Response, next: Function) {
    let user = await userCreator(req.body.username, req.body.password);
    req.session.username = user.username
    req.session.validated2FA = true


    res.json({message: "registered"});
    next();
}

async function retrieverOtpToken(req: Request, res: Response, next: Function) {
    if (!req.session.username) {
        res.statusCode = 401;
    } else {
        let user = await findUser(req.session.username);
        if (!user) {
            res.statusCode = 403;
        } else {
            res.json({secret: user.otpSecret});
        }
    }
    next();
}

async function login(req: Request, res: Response, next: Function) {
    let user = await findUser(req.body.username);

    if (user != null && await user.checkPassword(req.body.password)) {
        res.json({message: "Logged in!"});
        req.session.username = user.username
        req.session.validated2FA = false
    } else {
        res.status(401).json({message: "Invalid login"});
        req.session.username = undefined
        req.session.validated2FA = false
    }
    next();
}


async function validate2FA(req: Request, res: Response, next: Function) {
    if (req.session.username) {
        let user = await findUser(req.session.username)
        if (user?.checkOtpToken(req.body.token)){
            req.session.validated2FA = true;
            res.json({message: "Valid"});
        } else {
            res.status(401).json({message: "Invalid token"})
        }
    } else {
        res.status(401).json({message: "Not logged in"})
    }
    next();
}

async function checkLogin(req: Request, res: Response, next: Function) {
    if (!req.session.username) {
        res.status(401).json("Not logged int")
    } else if (!req.session.validated2FA) {
        res.status(401).json("Token not validated")
    } else {
        res.json("Logged in")
    }
}

export {
    register,
    login,
    retrieverOtpToken,
    validate2FA,
    checkLogin
}