import http, { Server } from 'http';
import 'dotenv/config';

export class App {
    server: Server;
    port: any;
    // users: IUser[] = [];

    constructor() {
        this.server = http.createServer((req, res) => {
            // const userRouter = new UserRouter(req, res, this.users);
            // userRouter.route();
        });

        this.port = process.env.PORT || 3000;
    }

    init() {
        this.server.listen(this.port, () =>
            console.log(`Server has been running on port ${this.port}`),
        );
    }
}
