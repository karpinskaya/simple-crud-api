import http, { Server, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import IUser from './user/user.interface';
import UserRouter from './user/user.router';

export default class App {
    server: Server;
    port: any;
    users: IUser[] = [
        {
            id: '1',
            username: 'User 1',
            age: 1,
            hobbies: [''],
        },
        {
            id: '2',
            username: 'User 2',
            age: 2,
            hobbies: [''],
        },
        {
            id: '3',
            username: 'User 3',
            age: 3,
            hobbies: [''],
        },
    ];

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
