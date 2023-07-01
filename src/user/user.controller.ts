import { IncomingMessage, ServerResponse } from 'http';
import IUser from './user.interface';
import UserModel from './user.model';

export default class UserController {
    req: IncomingMessage;
    res: ServerResponse;
    users: IUser[];
    userModel: UserModel;

    constructor(req: IncomingMessage, res: ServerResponse, users: IUser[]) {
        this.req = req;
        this.res = res;
        this.users = users;
        this.userModel = new UserModel(users);
    }

    getUsers() {
        const users = this.userModel.findAll();
        this.res.writeHead(200, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(users));
    }

    getUser() {
        //
    }

    createUser() {
        //
    }

    updateUser() {
        //
    }

    deleteUser() {
        //
    }
}
