import http, { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import router from './user.router';

dotenv.config();

const server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
        router(req, res);
    }
);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
