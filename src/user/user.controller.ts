import { IncomingMessage, ServerResponse } from 'http';
import UserModel from './user.model';
import IUser from './user.interface';
import { v4 as uuidv4 } from 'uuid';

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
        const userId = getIdFromUrl(this.req);

        if (!userId || !isUuid(userId)) {
            this.res.writeHead(400, { 'Content-Type': 'application/json' });
            this.res.end(
                JSON.stringify({ message: 'User ID is invalid (not uuid)' }),
            );
        } else {
            const user = this.userModel.findById(userId);

            if (user) {
                this.res.writeHead(200, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify(user));
            } else {
                this.res.writeHead(404, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify({ message: 'User was not found' }));
            }
        }
    }

    createUser() {
        let userData = '';

        this.req.on('data', (chunk) => {
            userData += chunk.toString();
        });

        this.req.on('end', () => {
            if (!isValidReqBody(JSON.parse(userData))) {
                this.res.writeHead(400, { 'Content-Type': 'application/json' });
                this.res.end(
                    JSON.stringify({
                        message:
                            'Request body does not contain required fields',
                    }),
                );
            } else {
                const newUser: IUser = {
                    id: uuidv4(),
                    ...JSON.parse(userData),
                };
                this.userModel.create(newUser);
                this.res.writeHead(201, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify(newUser));
            }
        });
    }

    updateUser() {
        const userId = getIdFromUrl(this.req);

        if (!userId || !isUuid(userId)) {
            this.res.writeHead(400, { 'Content-Type': 'application/json' });
            this.res.end(
                JSON.stringify({ message: 'User ID is invalid (not uuid)' }),
            );
        } else {
            const user = this.userModel.findById(userId);

            if (!user) {
                this.res.writeHead(404, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify({ message: 'User was not found' }));
            } else {
                let userData = '';

                this.req.on('data', (chunk) => {
                    userData += chunk.toString();
                });

                this.req.on('end', () => {
                    const updUserData: IUser = JSON.parse(userData);

                    const updUser = this.userModel.update(userId, updUserData);
                    this.res.writeHead(200, {
                        'Content-Type': 'application/json',
                    });
                    this.res.end(JSON.stringify(updUser));
                });
            }
        }
    }

    deleteUser() {
        const userId = getIdFromUrl(this.req);

        if (!userId || !isUuid(userId)) {
            this.res.writeHead(400, { 'Content-Type': 'application/json' });
            this.res.end(
                JSON.stringify({ message: 'User ID is invalid (not uuid)' }),
            );
        } else {
            const user = this.userModel.findById(userId);

            if (!user) {
                this.res.writeHead(404, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify({ message: 'User was not found' }));
            } else {
                const remUser = this.userModel.delete(userId);
                this.res.writeHead(204, { 'Content-Type': 'application/json' });
                this.res.end();
            }
        }
    }
}

const getIdFromUrl = (req: IncomingMessage) => {
    const id = req.url?.split('/')[3];
    return id;
};

const isUuid = (id: string) => {
    return id.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
};

const isValidReqBody = (reqBody: Object) => {
    return (
        Object.keys(reqBody).length === 3 &&
        Object.keys(reqBody).includes('username') &&
        Object.keys(reqBody).includes('age') &&
        Object.keys(reqBody).includes('hobbies')
    );
};
