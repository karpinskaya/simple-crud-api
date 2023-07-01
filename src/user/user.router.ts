import { IncomingMessage, ServerResponse } from 'http';
import IUser from './user.interface';
import UserController from './user.controller';

export default class UserRouter {
    req: IncomingMessage;
    res: ServerResponse;
    users: IUser[];
    userController: UserController;

    constructor(req: IncomingMessage, res: ServerResponse, users: IUser[]) {
        this.req = req;
        this.res = res;
        this.users = users;
        this.userController = new UserController(req, res, users);
    }

    route() {
        if (this.req.url === '/api/users' && this.req.method === 'GET') {
            this.userController.getUsers();
        }
    }
}
