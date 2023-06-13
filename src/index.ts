import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: "Hey", message: "Hello", secondMessage: "It's me" })
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});