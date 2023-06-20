import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.json())

import { authRouter } from './routes/auth';

app.use('/v1/auth', authRouter)
app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: "Hey", message: "Hello", secondMessage: "It's me" })
})

app.listen(port, () => {
    sequelize.sync({ force: true });

    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export {
    app,
    sequelize
}