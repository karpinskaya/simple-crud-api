import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from './user.model';
import { v4 as uuidv4 } from 'uuid';

const users: IUser[] = [];

export const getAllUsers = (res: ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
};

export const getUserById = (req: IncomingMessage, res: ServerResponse) => {
    const userId = getUserIdFromUrl(req);

    if (!userId || !isUuid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User ID is invalid (not uuid)' }));
    } else {
        const user = users.find((u) => u.id === userId);

        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User was not found' }));
        }
    }
};

export const postUser = (req: IncomingMessage, res: ServerResponse) => {
    let userData = '';

    req.on('data', (chunk) => {
        userData += chunk.toString();
    });

    req.on('end', () => {
        if (!isValidPostBody(JSON.parse(userData))) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    message: 'Request body does not contain required fields',
                })
            );
        } else {
            const newUser: IUser = {
                id: uuidv4(),
                ...JSON.parse(userData),
            };

            users.push(newUser);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        }
    });
};

export const putUser = (req: IncomingMessage, res: ServerResponse) => {
    const userId = getUserIdFromUrl(req);

    if (!userId || !isUuid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User ID is invalid (not uuid)' }));
    } else {
        const user = users.find((u) => u.id === userId);

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User was not found' }));
        } else {
            let userData = '';

            req.on('data', (chunk) => {
                userData += chunk.toString();
            });

            req.on('end', () => {
                const updUserData: IUser = JSON.parse(userData);
                const index = users.findIndex((u) => u.id === userId);

                users[index] = Object.assign(users[index] || {}, updUserData);

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify(users[index]));
            });
        }
    }
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
    const userId = getUserIdFromUrl(req);

    if (!userId || !isUuid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User ID is invalid (not uuid)' }));
    } else {
        const user = users.find((u) => u.id === userId);

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User was not found' }));
        } else {
            const index = users.findIndex((u) => u.id === userId);

            users.splice(index, 1);

            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
        }
    }
};

export const getUserIdFromUrl = (req: IncomingMessage) => {
    const id = req.url?.split('/')[3];
    return id;
};

export const isUuid = (id: string) => {
    return id.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
};

export const isValidPostBody = (postBody: any): postBody is IUser => {
    return 'username' in postBody && 'age' in postBody && 'hobbies' in postBody;
};
