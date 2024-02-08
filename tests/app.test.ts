import dotenv from 'dotenv';
import request from 'supertest';
import { server, PORT, appListen, appClose } from '../src/app';

dotenv.config();

describe('Create, update and delete user', () => {
    beforeAll(() => {
        appListen(server);
    });

    afterAll(() => {
        appClose(server);
    });

    const user = {
        username: 'Masha',
        age: 18,
        hobbies: ['reading', 'singing'],
    };

    let id = '';

    test('get all records with a GET api/users request (an empty array is expected)', async () => {
        const response = await request(`localhost:${PORT}`).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test('a new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
        const response = await request(`localhost:${PORT}`)
            .post('/api/users')
            .send(user);

        id = response.body.id;

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({ id, ...user });
    });

    test('with a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
        const response = await request(`localhost:${PORT}`).get(
            `/api/users/${id}`
        );

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ id, ...user });
    });

    test('we try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)', async () => {
        const updInfo = { age: 20 };
        const updUser = Object.assign(user, updInfo);

        const response = await request(`localhost:${PORT}`)
            .put(`/api/users/${id}`)
            .send(updInfo);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ id, ...updUser });
    });

    test('with a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
        const response = await request(`localhost:${PORT}`).delete(
            `/api/users/${id}`
        );

        expect(response.status).toBe(204);
    });

    test('with a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)', async () => {
        const response = await request(`localhost:${PORT}`).get(
            `/api/users/${id}`
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: 'User was not found' });
    });
});

describe('Create several users, create user using object without all required fields and try to rich non-existent endpoints', () => {
    beforeAll(() => {
        appListen(server);
    });

    afterAll(() => {
        appClose(server);
    });

    const user = {
        username: 'Masha',
        age: 18,
        hobbies: ['reading', 'singing'],
    };

    const fakeUser = {
        username: 'Masha',
        age: 18,
    };

    test('create 3 users and get all records with a GET api/users request (an array of 3 records is expected)', async () => {
        await request(`localhost:${PORT}`).post('/api/users').send(user);
        await request(`localhost:${PORT}`).post('/api/users').send(user);
        await request(`localhost:${PORT}`).post('/api/users').send(user);

        const response = await request(`localhost:${PORT}`).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(3);
    });

    test('create user with a GET api/users request using object without all required fields (an array of 3 records is expected)', async () => {
        const response = await request(`localhost:${PORT}`)
            .post('/api/users')
            .send(fakeUser);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            message: 'Request body does not contain required fields',
        });
    });

    test('try to get non-existent user with a GET api/users/{userId} request using random uuid (expected answer is that there is no such object)', async () => {
        const randomUuid = '0bee8b01-c52d-41c5-80d2-03d0ea02a6c8';
        const response = await request(`localhost:${PORT}`).get(
            `/api/users/${randomUuid}`
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: 'User was not found' });
    });

    test('try to rich non-existent endpont with a GET api/users/posts request (expected answer is that page is not found)', async () => {
        const response = await request(`localhost:${PORT}`).get(
            '/api/users/posts'
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: 'Page was not found' });
    });
});
