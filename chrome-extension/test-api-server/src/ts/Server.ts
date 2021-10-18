
import express from 'express';
import cors from 'cors';
import * as path from 'path';

export default class Server {
    private readonly app: express.Application = express();
    private port: number;
    private mal: boolean;

    public constructor(port = 8000) {
        this.port = port;
        this.app.use(express.json());
        this.app.set('view engine', 'pug');
        this.app.set('views', path.resolve(__dirname, '../src/pug'));
        this.mal = false;
    }

    public start(): void {
        this.app.all('*', (req, _, next) => {
            console.log(`${req.method} ${req.originalUrl}`);
            next();
        });

        this.app.get('/', (_, res) => {
            res.render('index', {
                title: 'Home',
                header: 'Home',
                content: 'Welcome home!'
            });
        });

        this.app.post("*", cors(), (_, res) => {
            this.mal = !this.mal;
            res.status(200).json({
                "malicious": this.mal,
            })
        })

        this.app.listen(this.port, () => {
            console.log(`Listening at http://localhost:${this.port}`);
        });
    }
}
