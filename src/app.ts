import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import session from 'express-session';

const sequelize = new Sequelize('sqlite::memory:');


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static(__dirname + '/statics'))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }))

import { authRouter } from './routes/auth';

app.use('/v1/auth', authRouter)
app.get('/', (req: Request, res: Response) => {
    res.redirect('/home.html')
})

app.listen(port, () => {
    sequelize.sync({ force: true });

    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export {
    app,
    sequelize
}