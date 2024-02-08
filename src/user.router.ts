import { IncomingMessage, ServerResponse } from 'http';
import {
    getAllUsers,
    getUserById,
    postUser,
    putUser,
    deleteUser,
    getUserIdFromUrl,
    isUuid,
} from './user.controller';

const router = (req: IncomingMessage, res: ServerResponse) => {
    try {
        if (req.method === 'GET' && req.url === '/api/users') {
            getAllUsers(res);
        } else if (
            req.method === 'GET' &&
            req.url?.match(/\/api\/users\/\w+/) &&
            isUuid(getUserIdFromUrl(req) || '')
        ) {
            getUserById(req, res);
        } else if (req.method === 'POST' && req.url === '/api/users') {
            postUser(req, res);
        } else if (
            req.method === 'PUT' &&
            req.url?.match(/\/api\/users\/\w+/) &&
            isUuid(getUserIdFromUrl(req) || '')
        ) {
            putUser(req, res);
        } else if (
            req.method === 'DELETE' &&
            req.url?.match(/\/api\/users\/\w+/) &&
            isUuid(getUserIdFromUrl(req) || '')
        ) {
            deleteUser(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Page was not found' }));
        }
    } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
    }
};

export default router;
