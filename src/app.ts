import http, { Server, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import UserRouter from './user/user.router';
import IUser from './user/user.interface';

export default class App {
    server: Server;
    port: any;
    users: IUser[] = [];

    constructor() {
        this.server = http.createServer(
            (req: IncomingMessage, res: ServerResponse) => {
                const userRouter = new UserRouter(req, res, this.users);
                userRouter.route();
            },
        );

        this.port = process.env.PORT || 3000;
    }

    init() {
        this.server.listen(this.port, () =>
            console.log(`Server has been running on port ${this.port}`),
        );
    }
}
