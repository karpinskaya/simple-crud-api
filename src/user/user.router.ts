import { IncomingMessage, ServerResponse } from 'http';
import UserController from './user.controller';
import IUser from './user.interface';

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
        try {
            if (this.req.url === '/api/users' && this.req.method === 'GET') {
                this.userController.getUsers();
            } else if (
                this.req.url?.match(/\/api\/users\/\w+/) &&
                this.req.method === 'GET'
            ) {
                this.userController.getUser();
            } else if (
                this.req.url === '/api/users' &&
                this.req.method === 'POST'
            ) {
                this.userController.createUser();
            } else if (
                this.req.url?.match(/\/api\/users\/\w+/) &&
                this.req.method === 'PUT'
            ) {
                this.userController.updateUser();
            } else if (
                this.req.url?.match(/\/api\/users\/\w+/) &&
                this.req.method === 'DELETE'
            ) {
                this.userController.deleteUser();
            } else {
                this.res.writeHead(404, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify({ message: 'Page was not found' }));
            }
        } catch {
            this.res.writeHead(500, { 'Content-Type': 'application/json' });
            this.res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    }
}
