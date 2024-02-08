import http, { IncomingMessage, ServerResponse, Server } from 'http';
import dotenv from 'dotenv';
import router from './user.router';

dotenv.config();

export const server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
        router(req, res);
    }
);

export const PORT = process.env.PORT || 3000;

export const appListen = (server: Server) => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

export const appClose = (server: Server) => {
    server.close();
};
